const ExampleUserList = new Array(20);
interface User {
  userID: string;
  username: string;
  email: string;
  about: string;
  websiteUrl: string;
  profilePicture: string;
  coverPicture: string;
}
const createUsersArray = (arr: User[]) => {
  for (let i = 0; i < arr.length; i++) {
    arr[i] = {
      userID: `user_${i}`,
      username: `exampleUsername${i}`,
      email: `exampleUsername${i}@gmail.com`,
      about:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      websiteUrl: `www.exampleUser${i}.com`,
      profilePicture: `https://picsum.photos/id/${Math.round(
        Math.random() * 100
      )}/200`,
      coverPicture: `https://picsum.photos/id/${Math.round(
        Math.random() * 100
      )}/200`,
    };
  }
};

createUsersArray(ExampleUserList);
export default ExampleUserList;
