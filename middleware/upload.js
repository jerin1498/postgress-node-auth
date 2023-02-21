exports.uploadFile = async (req) => {

    let image = req.files.banner;

    //console.log("File " , image);

    image.mv("./Content/Images/" + image.name, async (err, done) => {
       if (err) {
         console.log("err");
       }
    });

    return image.name;


    // return new Promise((resolve, reject) => {

    //     let file = req.files.resumefile;
    //     let currentTime = Date.now();

    //     let name = currentTime + file.name;
    //     var params = {
    //         Bucket: process.env.AWS_FILES_BUCKET,
    //         Key: name,
    //         Body: file.data,
    //     };


    //     s3bucket.upload(params, (err, data) => {
    //         if (err) {
    //             reject(err)
    //             console.log(err)
    //         }
    //         else {
    //             console.log("THIS IS MY FILES PATHHHHH", data.Location);
    //             resolve(data.Location)

    //         }
    //     })

    // })

};