import { Client, Users, Databases, Query } from 'node-appwrite';
import moment from 'moment-timezone';

// This Appwrite function will be executed every time your function is triggered
export default async ({ req, res, log, error }) => {
    // You can use the Appwrite SDK to interact with other services
    // For this example, we're using the Users service
    const client = new Client()
        .setEndpoint(process.env.APPWRITE_FUNCTION_API_ENDPOINT)
        .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
        .setKey(req.headers['x-appwrite-key'] ?? '');
    const users = new Users(client);

    const databases = new Databases(client, '63446ca755a041305f7f');

    const datebaseID = "63446ca755a041305f7f";

    var DBCollectionArray = new Map();

    DBCollectionArray.set('vbx_error_log', '667698d85d98f40d9f97');

    try {
        const response = await users.list();
        // Log messages and errors to the Appwrite Console
        // These logs won't be seen by your end users
        log(`Total users: ${response.total}`);
    } catch (err) {
        error("Could not list users: " + err.message);
    }

    // The req object contains the request data
    if (req.path === "/ping") {
        const now = new Date();

        res.json({

            date: now,
            status: 'alive'

        });
    }

    // The req object contains the request data
    if (req.path === "/test") {

        try {
            // Await deleteDocuments within an async function
            const delresult = await deleteDocuments();

            // Send the result as a response
            return res.send(delresult);
        } catch (error) {
            // Handle errors
            console.error("Error deleting documents:", error);
            return res.status(500).send("Error deleting documents");
        }

    }

    async function deleteDocuments() {

        // Calculate the date 60 days ago
        const sixtyDaysAgo = moment().subtract(60, 'days');

        let allDocuments = [];

        let page = await databases.listDocuments(datebaseID, DBCollectionArray.get('vbx_error_log'),
            [
                Query.limit(25)

                // Query.orderDesc("response_date ")
            ]

        );

        while (page.documents.length > 0) {
            // process the documents in the page
            page.documents.forEach(document => {


                allDocuments = allDocuments.concat(document);
                // do something with the document
            });

            const lastId = page.documents[page.documents.length - 1].$id;

            console.log('last id events array ----->>>: ', lastId);

            page = await databases.listDocuments(datebaseID, DBCollectionArray.get('vbx_error_log'),
                [
                    Query.limit(25),
                    Query.cursorAfter(lastId)
                ]
            );
        }

        // Filter documents that are older than 60 days
        const countDocuments = allDocuments.filter(doc =>
            moment(doc.log_date).isBefore(sixtyDaysAgo)
        );

        // Delete the filtered documents
        const deletePromises = allDocuments.map(doc =>
            databases.deleteDocument(datebaseID, DBCollectionArray.get('vbx_error_log'), doc.$id)
        );


        log(`Number of documents older than 60 days: ${countDocuments.length}`);

        log('all error array len ----->>>: ', allDocuments.length);

        log('delete promises ----->>>: ', deletePromises);

        return allDocuments.length + " / " + countDocuments.length + " / " + deletePromises

    }

    return res.json({
        result: "no function executed ...",

    });

    /*     (async () => {
            await deleteDocuments();
        })(); */


};