const Campground = require('./models/campground');
const Comment = require('./models/comment');

const data = [
    {
        name: "Cloud's Rest",
        image: "https://images.pexels.com/photos/3232542/pexels-photo-3232542.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
        description: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Soluta totam cupiditate voluptates, odio excepturi quibusdam blanditiis quas incidunt tempore sapiente accusamus suscipit assumenda nulla ab modi, cum veritatis, deleniti provident officiis illo unde quod rem illum tempora. Officiis, explicabo, quos ab veniam itaque error ex autem, vitae sed vero blanditiis."
    },
    {
        name: "Desert Mesa",
        image: "https://images.pexels.com/photos/3326156/pexels-photo-3326156.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
        description: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Soluta totam cupiditate voluptates, odio excepturi quibusdam blanditiis quas incidunt tempore sapiente accusamus suscipit assumenda nulla ab modi, cum veritatis, deleniti provident officiis illo unde quod rem illum tempora. Officiis, explicabo, quos ab veniam itaque error ex autem, vitae sed vero blanditiis."
    },
    {
        name: "Canyon Floor",
        image: "https://images.pexels.com/photos/618848/pexels-photo-618848.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
        description: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Soluta totam cupiditate voluptates, odio excepturi quibusdam blanditiis quas incidunt tempore sapiente accusamus suscipit assumenda nulla ab modi, cum veritatis, deleniti provident officiis illo unde quod rem illum tempora. Officiis, explicabo, quos ab veniam itaque error ex autem, vitae sed vero blanditiis."
    },
]

module.exports = function seedDB() {
    Comment.deleteMany({}, (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log("Removed Comments");
            // Remove all campgrounds
            Campground.deleteMany({}, (err) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Removed campgrounds!");
                    // Add a few campgrounds
                    // data.forEach((seed) => {
                    //     Campground.create(seed, (err, campground) => {
                    //         if (err) {
                    //             console.log(err);
                    //         } else {
                    //             console.log("Added a campground");
                    //             Comment.create(
                    //                 {
                    //                     text: "This place is great, but I wish there was internet.",
                    //                     author: "Homer"
                    //                 }, (err, comment) => {
                    //                     if (err) {
                    //                         console.log(err);
                    //                     } else {
                    //                         campground.comments.push(comment);
                    //                         campground.save(() => {
                    //                             console.log("Created new comment");
                    //                         });
                    //                     }
                    //                 });
                    //         }
                    //     });
                    // });
                }
            });
        }
    });
}