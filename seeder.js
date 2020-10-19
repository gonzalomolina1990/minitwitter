const faker = require("faker");
faker.locale = "es_MX";
const bcrypt = require("bcryptjs");
const User = require("./db/models/userModel");
const Tweet = require("./db/models/tweetModel");

module.exports = {
  seeder: async () => {
    for (let i = 0; i < 20; i++) {
      const user = new User({
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        userName: faker.internet.userName(),
        email: faker.internet.email(),
        bio: faker.lorem.words(50),
        password: await bcrypt.hash("clave", 10),
        userPhoto: faker.internet.avatar(),
      });
      for (let j = 0; j < 2; j++) {
        const tweet = new Tweet({
          text: faker.lorem.words(40),
          user: user,
          creationDate: faker.date.recent(),
          likes: faker.random.number(),
        });
        await tweet.save();
        user.userTweets.push(tweet);
      }
      await user.save();
    }
  },
};
