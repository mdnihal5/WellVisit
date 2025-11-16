adCodeStats = async (body, user) => {
    try {
        const { date, lang_id } = body;

        const tempDate = new Date(date);
        const startOfDay = new Date(tempDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(tempDate);
        endOfDay.setHours(23, 59, 59, 999);

        const startUnix = Math.floor(startOfDay.getTime() / 1000);
        const endUnix = Math.floor(endOfDay.getTime() / 1000);
        console.log(startUnix, endUnix);
        const month = tempDate.getMonth() + 1;
        const year = tempDate.getFullYear();
        const formattedDate = `${year}-${String(month).padStart(2, "0")}-${String(tempDate.getDate()).padStart(2, "0")}`;
        const table = `${config.w2nCHDB1}.ads_events_details_${month}_${year}`;

        let result = await pool.query(network_ads_updates.getDataWithName, [startUnix, endUnix, lang_id]);
        if (result.rowCount === 0) return { clickhouse: [], ad_partner_stats: [] };
        result = result.rows;

        const ad_code_ids = result.map((r) => r.value);
        const adCodesString = ad_code_ids.map((id) => `'${id}'`).join(", ");
        const ad_partner_ids = [...new Set(result.map((r) => r.ad_partner_id))];
        const stats = await pool.query(network_ads_updates.getAdPartnerStats, [startUnix, endUnix, ad_partner_ids, lang_id]);

        // STEP 1 — map ad_code → ad_partner_name
        const adPartnerMap = Object.fromEntries(result.map(({ value, ad_partner_name }) => [value, ad_partner_name]));

        let chQuery = `
            SELECT track_date AS date, lang_id, ad_code, ad_type, COUNT(*) AS count
            FROM ${table}
            WHERE track_date = '${formattedDate}' 
                AND ad_code IN (${adCodesString}) 
                AND ad_type IN ('display','request') 
                AND lang_id != 10
            `;
        if (lang_id) chQuery += ` AND lang_id = ${lang_id}`;
        chQuery += ` GROUP BY track_date, ad_code, lang_id, ad_type ORDER BY track_date, ad_code, ad_type`;

        const clickhouseData = await clickhouse_conn_live.query(chQuery, {});

        const chGrouped = {};

        for (const row of clickhouseData) {
            const key = `${row.date}_${row.lang_id}_${row.ad_code}`;
            if (!chGrouped[key]) {
                chGrouped[key] = {
                    date: row.date,
                    lang_id: row.lang_id,
                    ad_code: row.ad_code,
                    ad_partner_name: adPartnerMap[row.ad_code] || null,
                    aps_display: 0,
                    aps_request: 0,
                    aps_clicks: 0,
                    aps_revenue: 0,
                };
            }

            if (row.ad_type === "display") chGrouped[key].aps_display = row.count;
            if (row.ad_type === "request") chGrouped[key].aps_request = row.count;
        }
        for (const s of stats.rows) {
            const date = s.day.toISOString().slice(0, 10);

            const ad_code = Object.keys(adPartnerMap).find((code) => adPartnerMap[code] === s.ad_partner_name);
            if (!ad_code) continue;

            const finalKey = `${date}_${s.lang_id}_${ad_code}`;
            if (!chGrouped[finalKey]) continue;

            chGrouped[finalKey].aps_clicks = s.clicks;
            chGrouped[finalKey].aps_revenue = s.revenue;
        }

        const finalResult = Object.values(chGrouped);
        return finalResult;
    } catch (error) {
        console.error("Error in adCodeStats:", error);
        throw error;
    }
};
