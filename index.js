import { Client, Users, Databases, Query } from 'node-appwrite';

// This Appwrite function will be executed every time your function is triggered
export default async ({ req, res, log, error }) => {
    // You can use the Appwrite SDK to interact with other services
    // For this example, we're using the Users service
    const client = new Client()
        .setEndpoint(process.env.APPWRITE_FUNCTION_API_ENDPOINT)
        .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
        .setKey(req.headers['x-appwrite-key'] ?? '');
    const users = new Users(client);
    const databases = new Databases(client);

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
        // Use res object to respond with text(), json(), or binary()
        // Don't forget to return a response!
        return res.text("Pong");
    }
    async function deleteDocuments() {

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

            page = await databases.listDocuments(datebaseID, DBCollectionArray.get('event_received'),
                [
                    Query.limit(25),
                    Query.cursorAfter(lastId)
                ]
            );
        }

        console.log('all events array ----->>>: ', allDocuments)

        res.json({

            result: allDocuments.length
        });

    }

    (async () => {
        await deleteDocuments();
    })();


};