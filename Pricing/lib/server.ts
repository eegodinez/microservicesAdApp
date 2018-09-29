import app from "./app";
const PORT = 8085;

app.listen(PORT, () => {
    console.log('Express server listening on port ' + PORT);
}).on('error', err => {
    console.log('on error handler');
    console.log(err);
});

process.on('uncaughtException', err => {
    console.log('process.on handler');
    console.log(err);
});