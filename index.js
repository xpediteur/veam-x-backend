/* import { Client, Users, Databases, Query } from 'node-appwrite';
import moment from 'moment-timezone';
 */
// This Appwrite function will be executed every time your function is triggered new backend VEAM-X
export default async ({ req, res, log, error }) => {
    // You can use the Appwrite SDK to interact with other services
    // For this example, we're using the Users service
    /*     const client = new Client()
            .setEndpoint(process.env.APPWRITE_FUNCTION_API_ENDPOINT)
            .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
            .setKey(req.headers['x-appwrite-key'] ?? ''); */

    /*     const users = new Users(client);
    
        const datebaseID = process.env.APPWRITE_DATABASE_ID;
    
        const databases = new Databases(client, datebaseID);
    
        const deleteDays = process.env.APPWRITE_DELETE_DAYS || 60; */

    var DBCollectionArray = new Map();

    DBCollectionArray.set('vbx_error_log', '667698d85d98f40d9f97');

    // The req object contains the request data
    if (req.path === "/ping") {
        const now = new Date();

        res.json({

            date: now,
            status: 'alive'

        });
    }

    if (req.path === "/token") {

        try {
            const tokenData = await getVerkadaToken();
            if (!tokenData) {
                return res.status(500).json({ error: 'Token konnte nicht abgerufen werden' });
            }
            res.json(tokenData);
        } catch (err) {
            console.error("Unhandled error:", err);
            return res.status(500).json({ error: err.message });
        }

    }

    async function getVerkadaToken() {

        const url = `https://api.eu.verkada.com/token`;

        const VERKADA_API_KEY = process.env.APPWRITE_FUNCTION_VERKADA_API

        const options = {
            method: "POST",
            headers: {
                accept: "application/json",
                "x-api-key": VERKADA_API_KEY,
            },
        };

        try {
            const response = await fetch(url, options);

            if (!response.ok) {
                console.error(`Error fetching API key: ${response.statusText}`);
                return; // Ensure the rest of the function is skipped, but the program continues
            }

            const data = await response.json(); // Parse the JSON response body

            console.log("\r\n new Verkada Token: --->  ", data);

            return data;


        } catch (error) {
            console.error("\r\nError getting Token: " + error);
        }
    }


    return res.json({
        result: "no function executed ...",

    });

};