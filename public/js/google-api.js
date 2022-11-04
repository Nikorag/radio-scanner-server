let tokenClient;
let accessToken = null;
let pickerInited = false;
let gisInited = false;

// Use the API Loader script to load google.picker
function onApiLoad() {
    gapi.load('picker', onPickerApiLoad);
}

function onPickerApiLoad() {
    pickerInited = true;
}

function gisLoaded() {
    // TODO(developer): Replace with your client ID and required scopes
    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: "449770630054-mdd3e17dd9sfrsndhjlk7tlik9dgu3j3.apps.googleusercontent.com",
        scope: 'https://www.googleapis.com/auth/drive.file \
        https://www.googleapis.com/auth/drive \
        https://www.googleapis.com/auth/drive.file \
        https://www.googleapis.com/auth/drive.metadata',
        callback: '', // defined later
    });
    gisInited = true;
}

// Create and render a Picker object for selecting from Google Drive
function createPicker(callback) {
    const showPicker = (callback) => {
        // TODO(developer): Replace with your API key
        const picker = new google.picker.PickerBuilder()
            .addView(google.picker.ViewId.DOCS)
            .setOAuthToken(accessToken)
            .setDeveloperKey('AIzaSyDoeUdsCgIL-bZdvZVZ6uNHXNJlD7lBqI8')
            .setCallback(callback)
            .build();
        picker.setVisible(true);
    }

    // Use Google Identity Services to request an access token
    tokenClient.callback = async (response) => {
        if (response.error !== undefined) {
            throw (response);
        }
        accessToken = response.access_token;
        showPicker(callback);
    };

    if (accessToken === null) {
        // Prompt the user to select a Google Account and ask for consent to share their data
        // when establishing a new session.
        tokenClient.requestAccessToken({
            prompt: 'consent'
        });
    } else {
        // Skip display of account chooser and consent dialog for an existing session.
        tokenClient.requestAccessToken({
            prompt: ''
        });
    }
}

function getFile(data, callback) {
    if (data.action === google.picker.Action.PICKED) {
        var id = data.docs[0].id;
        const url = 'https://www.googleapis.com/drive/v3/files/' + id + '?alt=media'
        if (self.fetch) {
            var setHeaders = new Headers();
            setHeaders.append('Authorization', 'Bearer ' + accessToken);
            setHeaders.append('Content-Type', "text/csv");

            var setOptions = {
                method: 'GET',
                headers: setHeaders
            };
            fetch(url, setOptions)
                .then(response => {
                    if (response.ok) {
                        var reader = response.body.getReader();
                        var decoder = new TextDecoder();
                        reader.read().then(function(result) {
                            var data = {}
                            data = decoder.decode(result.value, {
                                stream: !result.done
                            });
                            callback(data);
                        });
                    } else {
                        console.log("Response wast not ok");
                    }
                }).catch(error => {
                    console.log("There is an error " + error.message);
                });
        }
    }
}