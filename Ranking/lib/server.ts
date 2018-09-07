import app from "./app";
const PORT = 8083;

app.listen(PORT, () => {
    console.log('Express server listening on port ' + PORT);
})