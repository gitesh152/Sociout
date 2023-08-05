import Post from '../models/Post.js';
import User from '../models/User.js';

let home;
export default home = async (req, res) => {
  try {
    // Populating posts with createdAt time, its user, its comments and comment user and likes, and post likes
    let posts = await Post.find({})
      .sort('-createdAt')
      .populate('user')
      .populate({
        path: 'comments',
        populate: { path: 'user likes' },
        options: { sort: '-createdAt' },
      })
      .populate({
        path: 'likes',
      });
    let users = await User.find({});

    //Initializing friends array
    let friends = new Array();
    if (req.user) {
      await req.user.populate({
        path: 'friendship',
        populate: { path: 'from_user to_user' },
      });

      //If friend of user, then push it to friend array
      for (let f of req.user.friendship) {
        if (req.user.id == f.from_user.id)
          friends.push({ userFriendshipId: f.id, userFriend: f.to_user });
        else if (req.user.id == f.to_user.id) {
          friends.push({ userFriendshipId: f.id, userFriend: f.from_user });
        }
      }
    }

    let envIp = process.env.IP;
    return res.render('home', {
      posts,
      users,
      friends,
      envIp,
    });
  } catch (error) {
    if (error) {
      req.flash('error', 'Error occured !!!');
      console.log(error);
    }
  }
};
