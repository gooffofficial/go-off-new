const express = require("express");
const router = express.Router();
const auth = require("../auth");
const crawler = require("../../apify/crawler");
const { body, query } = require("express-validator");
const db = require("../../models");
const Sequelize = require("sequelize");

const seq = new Sequelize(
  "test_server1",
  process.env.RDS_USER,
  process.env.RDS_PASSWORD,
  {
    port: process.env.RDS_PORT,
    host: process.env.RDS_HOSTNAME,
    dialect: "mysql",
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

const placeholderImg =
  "https://besthqwallpapers.com/Uploads/10-6-2020/135848/thumb2-gray-abstract-background-gray-luxury-background-gray-lines-background-gray-geometric-background.jpg";

router.use("/users", require("./users"));
router.use("/chat", require("./chat"));
router.use("/convos", require("./convos"));

// router.get('/folders', auth.required, (req, res, next) => {
//     const {payload: {id}} = req;
//     db.Folder.findAll({
//         where: {
//             UserId: id
//         }
//     }).then((folders) => {
//         return res.json(folders)
//     })
// })

// router.get('/getarticles', auth.required,[query('o').escape()], (req, res, next) => {
//     const {payload: {id}} = req;
//     var offset = req.query["o"]
//     // Query for next 4 articles from people the user is following based on the offset in the GET parameters
//     // seq.query("SELECT article FROM test_server1.SavedArticles S, test_server1.Followers Fol WHERE (Fol.follower = "+id+" AND Fol.followed=S.userId) ORDER BY S.createdAt DESC LIMIT 4 OFFSET "+ offset)

//     //Query for next 4 articles from the available pool
//     seq.query("SELECT article FROM test_server1.SavedArticles S ORDER BY S.createdAt DESC LIMIT 4 OFFSET "+ offset)
//     .then(async (articles) => {
//         console.log("LENGTH\n\n\n\n" + articles[0].length)
//         var arts = []
//         for(var i=0; i<articles[0].length; i++){
//             arts.push(articles[0][i].article)
//         }
//         console.log(arts)
//         var arts2 = []
//         // For every article found, we add the image title and link
//         for(const art of arts){
//             var art2 = {}
//             // Find the article in the Articles table in the database
//             let a = await db.Article.findOne({
//                 where: {
//                     url: art
//                 }
//             })
//             if (!a) {
//             art2['img'] = ""
//             art2['title'] = ""
//             art2['link'] = ""
//             }else{
//                 art2['img'] = a.getArticleInfo()['img']
//                 art2['title'] = a.getArticleInfo()['title']
//                 art2['link'] = a.getArticleInfo()['url']
//             }
//             arts2.push(art2)
//         }
//         console.log(arts2.length)
//         arts2 = arts2.reverse();
//         // Check to make sure we return an array of length 4
//         // Else fill in dummy entries
//         if(arts2.length == 0){
//             let a = {
//                 img: '',
//                 title: '',
//                 link: ''
//             }
//             arts2.push(a);
//             arts2.push(a);
//             arts2.push(a);
//             arts2.push(a);
//         }
//         if (arts.length == 1){
//             let a = {
//                 img: '',
//                 title: '',
//                 link: ''
//             }
//             arts2.push(a);
//             arts2.push(a);
//             arts2.push(a);
//         }
//         if (arts.length == 2){
//             let a = {
//                 img: '',
//                 title: '',
//                 link: ''
//             }
//             arts2.push(a)
//             arts2.push(a)
//         }
//         if (arts.length == 3){
//             let a = {
//                 img: '',
//                 title: '',
//                 link: ''
//             }
//             arts2.push(a)
//         }
//         return res.json(arts2);
//     })
// })

router.get("/gettopusers", auth.required, (req, res, next) => {
  const {
    payload: { id },
  } = req;

  console.log("User Grabbing \n\n\n");
  //grab top 10 users with the most followers and if we follow them or not
  //and their profile picture

  seq
    .query("SELECT id FROM test_server1.Users U ORDER BY U.followercount DESC")
    .then(async (users) => {
      tusers = [];
      console.log("test");
      console.log(users);
      for (const user of users[0]) {
        let f = await db.Followers.findOne({
          follower: req.id,
          followed: users.id,
        });
        let prof = await db.Profile.findOne({
          where: {
            id: users.id,
          },
        });

        if (req.id == users.id) {
          i++;
          break;
        }
        if (f) {
          tusers.push({
            hostName: users.username,
            hostpfp: prof.ppic,
            followercount: users.followercount,
            isFollowing: true,
          });
        } else {
          tusers.push({
            hostName: users.username,
            hostpfp: prof.ppic,
            followercount: users.followercount,
            isFollowing: false,
          });
        }
        i++;
      }
      console.log(tusers);
      return res.json(tusers);
    });
});
router.get(
  "/getconvos",
  auth.required,
  [query("o").escape()],
  (req, res, next) => {
    const {
      payload: { id },
    } = req;
    var offset = req.query["o"];
    console.log("AFGG\n\n\n");
    console.log(req.payload)
    // Same as above except with convos from people the user is following
    // seq.query("SELECT ConvoId FROM test_server1.Convo_members C, test_server1.Followers Fol WHERE Fol.follower = "+id+" AND Fol.followed=C.UserId ORDER BY C.createdAt DESC LIMIT 4 OFFSET "+ offset)

    // Same as above except for all convos
    seq
      .query(
        "SELECT ConvoId FROM test_server1.Convo_members C ORDER BY C.createdAt "
      )
      /*db.Convo_members.findAll({
            where: {
                UserId: id
            }
        })*/
        .then(async (convos) => {
            var convs = []
            var i = 0
            // console.log(convos)
            for (const convo of convos[0]){

                let c = await db.Convo.findOne({
                    where: {
                        id: convo.ConvoId
                    }
                })
                // console.log(c)
                // convs.push(c);
                let art = await db.Article.findOne({
                    where: {
                        url: c.article
                    }
                }) || {}
                let host = await db.User.findOne({
                    where: {
                        id: c.host
                    }
                })

                // let user = await db.User.findOne({
                //     where: {
                //         id: 
                //     }
                // })
                // console.log(c.host)
                // console.log(c.id)
                let prof = await db.Profile.findOne({
                    where: {
                        UserId: c.host
                    }
                }) || {}
                // console.log(prof)
                // console.log(c.host)
                // console.log(user)
                // if(c.host != user.id){

                    // if(new Date() > new Date(c.time)){
                        console.log("var test")
                        // console.log(req.payload.phonenumber, req.payload.email)
                        convs.push({
                            'articleURL': c.article,
                            'articleImg': art.img || placeholderImg,
                            'time': c.time,
                            'hostName': host.name,
                            'hostNum': host.phonenumber,
                            'roomId': c.roomId,
                            'convTitle': c.title,
                            'desc': c.description,
                            'hostID': host.id,
                            'hostpfp': prof.ppic,
                            'userID': req.payload.id,
                            'username': host.username,
                            'userPnum': req.payload.phonenumber,
                            'useremail': req.payload.email,
                        })
                    // }
                    // }
                    
                

          // }else{
          //     convs[i]['host'] = user.username
          // }

          // convs[i]['img'] = art.img
          // console.log(convs[i]['img'])
          // convs[i]['title'] = c.title
          // console.log(c.title)
          // console.log(convs)
          i++;
          // console.log("CONVOSSSSSSSSSSSS", convs)
        }
        convs = convs.reverse();
        // if(convs.length == 0) {
        //     convs[0] = {
        //         article: "",
        //         id: -1
        //     }
        //     convs[1] = {
        //         article: "",
        //         id: -1
        //     }
        //     convs[2] = {
        //         article: "",
        //         id: -1
        //     }
        //     convs[3] = {
        //         article: "",
        //         id: -1
        //     }
        // }
        // else if(convs.length == 1){
        //     convs[1] = {
        //         article: "",
        //         id: -1
        //     }
        //     convs[2] = {
        //         article: "",
        //         id: -1
        //     }
        //     convs[3] = {
        //         article: "",
        //         id: -1
        //     }
        // }
        // else if(convs.length == 2){
        //     convs[2] = {
        //         article: "",
        //         id: -1
        //     }
        //     convs[3] = {
        //         article: "",
        //         id: -1
        //     }
        // }
        // else if(convs.length == 3){
        //     convs[3] = {
        //         article: "",
        //         id: -1
        //     }
        // }
        return res.json(convs);
      });
  }
);

//get upcoming conversations for a user
// router.get('/upcoming', auth.required, async (req, res, next) => {
//     const {payload: {id}} = req;
//     console.log("AHH\n\n\n\n\n\n\n\n")
//     db.Convo_members.findAll({
//         where: {
//             UserId: id
//         }
//     }).then(async (convoIds) => {
//         let convos = []
//         let convsObjects = []
//         for (let i=0; i<convoIds.length; i++) {
//             var conv = await db.Convo.findOne({
//                 where: {
//                     id: convoIds[i].ConvoId
//                 }
//             })
//             // Check the date of the convo to see if it is within 30 minutes of current
//             if (Date.now() - conv.time < 30*(60*1000)){
//                 let article = await db.Article.findOne({ where: { url: conv.article } })
//                 let user = await db.User.findOne({ where: { id: conv.host } })
//                 convos.push({
//                   'articleURL': conv.article,
//                   'articleImg': article.img,
//                   'time': conv.time,
//                   'hostname': user.name,
//                   'roomId': conv.roomId,
//                   'convTitle': conv.title,
//                 })
//             }
//         }
//         return res.status(200).json(convos)
//     })
// })

//get upcoming conversations for a user
router.get("/upcoming", auth.required, async (req, res, next) => {
  const {
    payload: { id },
  } = req;
  console.log("AHH\n\n\n\n\n\n\n\n");
  db.Convo_members.findAll({
    where: {
      UserId: id,
    },
  }).then(async (convoIds) => {
    let convos = [];
    let convsObjects = [];
    for (let i = 0; i < convoIds.length; i++) {
      var conv = await db.Convo.findOne({
        where: {
          id: convoIds[i].ConvoId,
        },
      });
      // Check the date of the convo to see if it is within 30 minutes of current

      if (Date.now() - conv.time <= 1800000) {
        let article =
          (await db.Article.findOne({ where: { url: conv.article } })) || {};
        let user = await db.User.findOne({ where: { id: conv.host } });
        let profile = await db.Profile.findOne({
          where: { UserId: conv.host },
        });
        convos.push({
          articleURL: conv.article,
          articleImg: article.img || placeholderImg,
          time: conv.time,
          hostUsername: user.name,
          roomId: conv.roomId,
          convTitle: conv.title,
          hostAvatar: profile.ppic,
          convDesc: conv.description,
        });
      }
    }
    return res.status(200).json(convos);
  });
});

// router.get("/upcoming", auth.required, async (req, res, next) => {
//   const {
//     payload: { id },
//   } = req;
//   console.log("AHH\n\n\n\n\n\n\n\n");
//   db.Convo_members.findAll({
//     where: {
//       UserId: id,
//     },
//   }).then(async (convoIds) => {
//     let convos = [];
//     let convsObjects = [];
//     for (let i = 0; i < convoIds.length; i++) {
//       var conv = await db.Convo.findOne({
//         where: {
//           id: convoIds[i].ConvoId,
//         },
//       });
//       // Check the date of the convo to see if it is within 30 minutes of current
//       if (Date.now() - conv.time < 30 * (60 * 1000)) {
//         let article =
//           (await db.Article.findOne({ where: { url: conv.article } })) || {};
//         let user = await db.User.findOne({ where: { id: conv.host } });
//         let profile = await db.Profile.findOne({
//           where: { UserId: conv.host },
//         });
//         convos.push({
//           articleURL: conv.article,
//           articleImg: article.img || placeholderImg,
//           time: conv.time,
//           hostUsername: user.name,
//           roomId: conv.roomId,
//           convTitle: conv.title,
//           hostAvatar: profile.ppic,
//           convDesc: conv.description,
//         });
//       }
//     }
//     return res.status(200).json(convos);
//   });
// });

router.get("/upcoming/:username", auth.required, async (req, res, next) => {
  const {
    payload: { id },
  } = req;
  const viewUsername = req.params.username;
  let viewUser = await db.User.findOne({ where: { username: viewUsername } });
  if (!viewUser)
    return res.status(406).json({ error: "Username does not exist! " });
  db.Convo_members.findAll({
    where: {
      UserId: viewUser.id,
    },
  }).then(async (convoIds) => {
    let convos = [];
    let convsObjects = [];
    for (let i = 0; i < convoIds.length; i++) {
      var conv = await db.Convo.findOne({
        where: {
          id: convoIds[i].ConvoId,
        },
      });
      // Check the date of the convo to see if it is within 30 minutes of current
      if (Date.now() - conv.time < 0) {
        let article =
          (await db.Article.findOne({ where: { url: conv.article } })) || {};
        let user = await db.User.findOne({ where: { id: conv.host } });
        let profile = await db.Profile.findOne({
          where: { UserId: conv.host },
        });
        convos.push({
          articleURL: conv.article,
          articleImg: article.img || placeholderImg,
          time: conv.time,
          hostUsername: user.name,
          roomId: conv.roomId,
          convTitle: conv.title,
          hostAvatar: profile.ppic,
          convDesc: conv.description,
        });
      }
    }
    return res.status(200).json(convos);
  });
});

router.get("/pastconv/:username", auth.required, async (req, res, next) => {
  const {
    payload: { id },
  } = req;
  const viewUsername = req.params.username;
  let viewUser = await db.User.findOne({ where: { username: viewUsername } });
  if (!viewUser)
    return res.status(406).json({ error: "Username does not exist!" });
  db.Convo_members.findAll({
    where: {
      UserId: viewUser.id,
    },
  }).then(async (convoIds) => {
    let convos = [];
    let convsObjects = [];
    for (let i = 0; i < convoIds.length; i++) {
      var conv = await db.Convo.findOne({
        where: {
          id: convoIds[i].ConvoId,
        },
      });
      if (Date.now() > conv.time) {
        let article =
          (await db.Article.findOne({ where: { url: conv.article } })) || {};
        let user = await db.User.findOne({ where: { id: conv.host } });
        let profile = await db.Profile.findOne({
          where: { UserId: conv.host },
        });
        convos.push({
          articleURL: conv.article,
          articleImg: article.img || placeholderImg,
          time: conv.time,
          hostUsername: user.username,
          roomId: conv.roomId,
          convTitle: conv.title,
          hostAvatar: profile.ppic,
          convDesc: conv.description,
        });
      }
    }
    convos.sort((conv1, conv2) => conv2.time - conv1.time); // Sort convos from latest posted
    return res.status(200).json(convos);
  });
});

router.get("/pastconv", auth.required, async (req, res, next) => {
  const {
    payload: { id },
  } = req;
  db.Convo_members.findAll({
    where: {
      UserId: id,
    },
  }).then(async (convoIds) => {
    let convos = [];
    let convsObjects = [];
    for (let i = 0; i < convoIds.length; i++) {
      var conv = await db.Convo.findOne({
        where: {
          id: convoIds[i].ConvoId,
        },
      });
      if (Date.now() > conv.time) {
        let article =
          (await db.Article.findOne({ where: { url: conv.article } })) || {};
        let user = await db.User.findOne({ where: { id: conv.host } });
        let profile = await db.Profile.findOne({
          where: { UserId: conv.host },
        });
        convos.push({
          articleURL: conv.article,
          articleImg: article.img || placeholderImg,
          time: conv.time,
          hostUsername: user.username,
          roomId: conv.roomId,
          convTitle: conv.title,
          hostAvatar: profile.ppic,
          convDesc: conv.description,
        });
      }
    }
    convos.sort((conv1, conv2) => conv2.time - conv1.time); // Sort convos from latest posted
    return res.status(200).json(convos);
  });
});

// router.get('/savedarts', auth.required, (req, res, next) => {
//     const {payload: {id}} = req;
//     var foldname = req.query.namez;
//     console.log("AHHHHHHHHHHHHHHHHHHHHHHHHHHH", foldname, id);
//     db.Folder.findOne({
//         where: {
//             foldername: foldname,
//             UserId: id
//         }
//     }).then((folder) => {return res.json({id: folder.id})})
// db.Folder.findAll({
//     where:{
//         UserId: id,
//         foldername: foldname
//     }
// }).then((articles) => {
//     return res.json(articles)
// })
// })
/*
router.get('/update_article', auth.optional, (req,res, next) => {
    db.Profile.update({
        article1title: "It's the day before Election Day",
        article1img: "https://cdn.cnn.com/cnnnext/dam/assets/201030082605-04-trump-biden-election-night-split-super-tease.jpg",
        article1author: 'CNN',
        article1link: "https://www.cnn.com/politics/live-news/us-election-news-11-02-2020/index.html",
        article2title: "DFP | Restaurants brace for winter",
        article2img: 'https://dailyfreepress.com/wp-content/uploads/image1-27-431x288.jpg',
        article2author: 'Daniel Kool',
        article2link: 'https://dailyfreepress.com/2020/10/22/restaurants-brace-for-cold-weather-after-summer-of-outdoor-dining/',
        artice3title: 'The Startup Helping EVs Balance Out the Renewables That Power Them',
        article3img: "https://www.greentechmedia.com/assets/content/cache/made/assets/content/cache/remote/https_assets.greentechmedia.com/content/images/articles/Charging_EVs_Infrastructure_XL_500_281_80.jpg",
        article3author: 'John Parnell',
        article3link: "https://www.greentechmedia.com/articles/read/how-european-evs-are-balancing-out-the-renewables-that-power-them"
    },
    {
        where: {
            article1link: 'https://thesweatypenguin.com/wp-content/uploads/2020/10/FINAL-LIGHT-POLLUTION.mp3'
        }
    }).then(() => {
        return res.sendStatus(200);
    })
})
*/
module.exports = router;
