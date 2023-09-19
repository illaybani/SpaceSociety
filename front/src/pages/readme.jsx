import React from "react";

const ReadMe = () => {
  return (
    <>
      <style>
        {`
                .appInfo {
                    font-family: Arial, sans-serif;
                    background-color: #f5f5f5;
                    padding: 20px;
                    border-radius: 10px;
                    width: 80%;
                    margin: 20px auto;
                }

                .appInfo h1,
                .appInfo h2,
                .appInfo h3 {
                    color: #333;
                    border-bottom: 2px solid #ddd;
                    padding-bottom: 10px;
                }

                .appInfo p,
                .appInfo li {
                    color: #555;
                    font-size: 16px;
                }

                .appInfo ul,
                .appInfo ol {
                    margin-bottom: 20px;
                }

                .appInfo li {
                    margin-bottom: 10px;
                }
                `}
      </style>
      <div className="appInfo">
        <h4>In order to start the website you need:</h4>
        <ul>
          <li>In terminal write: npm install</li>
          <li>In terminal write: npm run start:staging</li>
        </ul>
        <h4>
          The data is stored in /server/data/users.json and in
          /server/data/cards.json
        </h4>
        <p>
          users.json stores all the users in the website, cards.json stores all
          the posts in the website
        </p>
        <h2>Social network name:</h2>
        <p>Space Society</p>
        <h2>What additional pages did you add?</h2>
        <ul>
          <li>Planets.jsx</li>
          <li>JamesWebb.jsx</li>
        </ul>
        <h2>What additional features did you add?</h2>
        <ul>
          <li>Likes counter for each post.</li>
          <li>The ability to like a post and then to undo the like.</li>
          <li>
            Posts I've liked page, where you can see all the posts that you've
            liked.
          </li>
          <li>
            My posts page, where you can see all the posts that you wrote. You
            can also edit your post and delete the post.
          </li>
          <li>
            My profile page, where you can see how many people you follow and
            how many people follow you. You can click on each count to see the
            users. You can also change your profile picture.
          </li>
          <li>
            Edit my info page, where you can update your information. In
            general, no matter what page you are on, there is a + button in the
            right bottom corner where you can upload a new post by clicking on
            it.
          </li>
        </ul>
        <h2>What was hard to do?</h2>
        <p>Illay: Learning React and Redux.</p>
        <p>Yoav: Separating the front and server sides.</p>
        <h2>
          Who is your partner? Name and ID. What did you do? What did your
          partner do?
        </h2>
        <p>
          We are Illay Bani (207250606) and Yoav Amit (314922956). Both of us
          worked on the app together, but Illay focused more on the front-end,
          and Yoav focused more on the server-side.
        </p>
        <h2>Specify all the different (server) routes your app supports:</h2>
        <h3>For users:</h3>
        <ol>
          <li>POST request to register a new user</li>
          <li>POST request to login a user</li>
          <li>GET request to get the details of a registered user</li>
          <li>GET request to get all the registered users</li>
          <li>
            PATCH request when a user follows or unfollows another user (update
            followers and following in the database)
          </li>
          <li>
            PUT request when a user is deleted by the admin (update followers
            and following in the database for affected users)
          </li>
          <li>PUT request to update user details</li>
          <li>PATCH request to update last login time of a user</li>
          <li>PUT request to update user image by image URL</li>
          <li>DELETE request to delete a user from the website</li>
        </ol>
        <h3>For cards:</h3>
        <ol>
          <li>GET request to get all cards (posts)</li>
          <li>GET request to get a card by ID</li>
          <li>GET request to get all cards of a specific user</li>
          <li>GET request to get a single card of a specific user</li>
          <li>GET request to get the number of cards in the database</li>
          <li>PUT request to update a card of a specific user</li>
          <li>
            PUT request to update all cards of a specific user by user ID when
            username/image changes
          </li>
          <li>POST request to create a new card</li>
          <li>DELETE request to delete a card</li>
          <li>
            PATCH request when a card is liked (update the likes field of the
            card in the database)
          </li>
        </ol>
      </div>
    </>
  );
};

export default ReadMe;
