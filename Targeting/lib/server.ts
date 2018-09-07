import app from "./app";
const PORT = 8082;

app.listen(PORT, () => {
    console.log('Express server listening on port ' + PORT);
})