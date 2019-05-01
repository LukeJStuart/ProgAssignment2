// Allowing ++s in for loops
/* eslint no-plusplus: [2, { allowForLoopAfterthoughts: true }] */
// Allowing alerts
/* eslint-disable no-alert */
// Allowing unnamed functions
/* eslint func-names: ["error", "never"] */
window.onload = async function () {
  const weatherres = await fetch('https://dataservice.accuweather.com/currentconditions/v1/328328?apikey=7cqA21o68GoPVUGSdbvGp0n1zdHGRtAO&lanuage=en-us&details=false');
  const weatherbody = await weatherres.json();
  document.getElementById('WeatherDescription').innerText = weatherbody[0].WeatherText;
  document.getElementById('Temperature').innerText = weatherbody[0].Temperature.Metric.Value;

  // code to check every 3 seconds weather the server is still connected
  setInterval(async () => {
    // try to carry out a fetch, if fails know issue
    try {
      // Have to disable eslint here as unused const used
      // to check server connection
      /* eslint-disable */
      const res = await fetch('/events/?');
      /* eslint-enable */
      /* eslint-disable no-alert */
    } catch (error) {
      alert('Server connection lost, try refreshing.');
    }
  }, 3000);

  const searchfunction = async function () {
    // event.preventDefault();
    document.getElementById('ErrorSection').innerHTML = '';
    // making sure that add event form is hidden
    document.getElementById('AddEventForm').hidden = true;
    document.getElementById('content').innerHTML = '';
    const res = await fetch('/events/?');
    const body = await res.json();
    const search = document.getElementById('SearchBar').value;
    const results = [];
    for (let i = 0; i < body.length; i++) {
      if (body[i].title.toLowerCase().includes(search.toLowerCase())) {
        results.push(body[i]);
      }
    }
    // Relevant events are now stored in list called results
    // Now need to define html for results and send to div with id content
    let html = '';

    if (results.length === 0) {
      // if no results, that is all that needs to be displayed
      html = '<p>No Results</p>';
    } else {
      // go through each result and add to html
      for (let i = 0; i < results.length; i++) {
        html += '<hr>';
        html += (`<a id='event${results[i].id}'>${results[i].title}</a>`);
        html += (`<p>${results[i].date}</p>`);
        html += (`<p>${results[i].place}</p>`);
        html += (`<p>${results[i].description}</p>`);
      }
      html += '<hr>';
    }
    document.getElementById('content').innerHTML = html;
    for (let i = 0; i < results.length; i++) {
      // it is necessary to create a function within a loop
      // to allow viewing of comments on results of search
      /* eslint-disable */
      document.getElementById(`event${results[i].id}`).addEventListener('click', async () => {
        /* eslint-enable */
        // if user clicks on the title of one of the events listed following the search,
        // new html must then be generated and sent to the content div to
        // display that specific event
        html = '<hr>';
        html += `<h3>${results[i].title}</h3>`;
        html += `<p>Date: ${results[i].date}</p>`;
        html += `<p>Place: ${results[i].place}</p>`;
        html += '<p>Description:</p>';
        html += `<p>${results[i].description}</p>`;
        html += '<hr>';
        // now need to get comments on this event
        // temporarily disable es-lint here as its advice results in failure
        /* eslint-disable */
        const res = await fetch('/comments/?');
        const body = await res.json();
        /* eslint-enable */
        /* eslint-disable no-alert */
        const relevantComments = [];
        for (let j = 0; j < body.length; j++) {
          if (parseInt(body[j].eventid, 10) === results[i].id) {
            relevantComments.push(body[j]);
          }
        }
        // relevant comments are now stored in a list
        // now need to add html for those comments
        if (relevantComments.length !== 0) {
          html += '<h4>Comments</h4>';
          for (let j = 0; j < relevantComments.length; j++) {
            html += "<div class='panel panel-default'>";
            html += "<div class='panel-body'>";
            html += `<p>Commenter: ${relevantComments[j].commenter}</p>`;
            html += `<p>Date: ${relevantComments[j].date}</p>`;
            html += `<p>Comment: ${relevantComments[j].comment}</p>`;
            html += '<p></p>';
            html += '</div>';
            html += '</div>';
          }
        }
        // storing copy of html without the form
        const htmlbeforeform = html;
        if (relevantComments.length === 0) {
          html += 'No Comments';
        }
        html += '<hr>';
        // Now need to form html for comment input form
        html += '<h4>Add Your Own Comment:</h4>';
        html += "<div class='form-group'>";
        html += "<label for='NameInput'>Name:</label>";
        html += "<input type='text' class='form-control' id='NameInput'>";
        html += '</div>';
        html += "<div class='form-group'>";
        html += "<label for='CommentBox'>Comment:</label>";
        html += "<textarea class='form-control' rows='5' id='CommentBox'></textarea>";
        html += '</div>';
        html += "<button class='btn btn-outline-success my-2 my-sm-0' type='submit' id='CommentButton'>Submit</button>";
        // using html
        document.getElementById('content').innerHTML = html;
        // Adding event listener for comment submission button
        document.getElementById('CommentButton').addEventListener('click', async (event2) => {
          event2.preventDefault();
          // before trying to leave comment need to check if event being commented on still exists
          // as if the user is trying to comment on an event added after the server first started
          // and the server has restarted since they opened the event page, then that event actually
          // no longer exists and so although the comment would be accepted it would appear nowhere
          const checkres = await fetch('/events/?');
          const checkbody = await checkres.json();
          let eventexists = false;
          let errorhtml = '';
          // only say event exists if the id of it is in one of the events found in new GET
          for (let k = 0; k < checkbody.length; k++) {
            if (checkbody[k].id === results[i].id) {
              eventexists = true;
            }
          }
          // only run attempt at POST if event still exists
          if (eventexists === true) {
            try {
              const accesstoken = 'EFGH';
              // generating today's date in same format as required by event form
              const today = new Date();
              let dd = today.getDate();
              let mm = today.getMonth() + 1;
              const yy = ((today.getFullYear()).toString()).slice(2, 4);
              if (dd < 10) {
                dd = `0${dd}`;
              }
              if (mm < 10) {
                mm = `0${mm}`;
              }
              const date = `${dd}/${mm}/${yy}`;
              const eventid = results[i].id;
              const commenter = document.getElementById('NameInput').value;
              const comment = document.getElementById('CommentBox').value;
              // can only submit a comment if have completed both fields
              let fieldsfilled = false;
              if ((commenter !== '') && (comment !== '')) {
                fieldsfilled = true;
              }
              if (fieldsfilled) {
                const response = await fetch('/comments',
                  {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: `accesstoken=${accesstoken}&date=${date}&eventid=${eventid}&commenter=${commenter}&comment=${comment}`,
                  });
                // Making it so that when they submit a comment their
                // comment is displayed and the form disappears
                html = htmlbeforeform;
                if (relevantComments.length === 0) {
                  html += '<h4>Comments</h4>';
                }
                html += "<div class='panel panel-default'>";
                html += "<div class='panel-body'>";
                html += `<p>Commenter: ${commenter}</p>`;
                html += `<p>Date: ${date}</p>`;
                html += `<p>Comment: ${comment}</p>`;
                html += '<p></p>';
                html += '</div>';
                html += '</div>';
                // Setting html to updated version with new comment
                document.getElementById('content').innerHTML = html;
                if (!response.ok) {
                  throw new Error(`problem adding comment${response.code}`);
                }
                // successful so no error
                document.getElementById('ErrorSection').innerHTML = '';
              } else {
                if (commenter === '') {
                  errorhtml += "<p style='color:red;'>No Name Entered</p>";
                }
                if (comment === '') {
                  errorhtml += "<p style='color:red;'>No Comment Entered</p>";
                }
                // update error section
                document.getElementById('ErrorSection').innerHTML = errorhtml;
              }
            } catch (error) {
              alert(`problem: ${error}`);
            }
          }
          if (eventexists === false) {
            document.getElementById('SearchBar').value = '';
            searchfunction();
            alert('That event no longer exists due to a server restart. Please refresh.');
          }
        });
      });
    }
  };

  // Code for search bar feature
  document.getElementById('SearchButton').addEventListener('click', searchfunction);

  // Code for 'Add Event' feature
  document.getElementById('AddEvent').addEventListener('click', async (event) => {
    event.preventDefault();
    // now unhide form
    document.getElementById('content').innerHTML = '';
    document.getElementById('AddEventForm').hidden = false;
  });

  // Code to ensure add event form is hidden when browse is pressed
  document.getElementById('Browse').addEventListener('click', async () => {
    document.getElementById('SearchBar').value = '';
    searchfunction();
  });

  // Code to ensure add event form is hidden when home button is pressed
  document.getElementById('HomeButton').addEventListener('click', async (event) => {
    event.preventDefault();
    document.getElementById('ErrorSection').innerHTML = '';
    document.getElementById('content').innerHTML = '';
    document.getElementById('AddEventForm').hidden = true;
  });

  // Code to post add event form submissions
  document.getElementById('SubmitEvent').addEventListener('click', async (event) => {
    event.preventDefault();
    let errorhtml = '';
    document.getElementById('ErrorSection').innerHTML = errorhtml;
    try {
      const accesstoken = 'ABCD';
      const date = document.getElementById('Date').value;
      const title = document.getElementById('Title').value;
      const place = document.getElementById('Place').value;
      const description = document.getElementById('Description').value;
      const adminpassword = document.getElementById('Password').value;

      // Need to check validity:
      // Check password = "admin"
      // Check date in correct format
      let validpassword = false;
      if (adminpassword === 'admin') {
        validpassword = true;
      }

      // Need to check if information submitted for title, place, and description
      let datapresent = false;
      if ((title !== '') && (place !== '') && (description !== '')) {
        datapresent = true;
      }
      let validdate = false;
      const dateformat = /^(0?[1-9]|[12][0-9]|3[01])[/](0?[1-9]|1[012])[/]\d{2}$/;
      if (date.match(dateformat)) {
        const splitdate = date.split('/');
        const day = parseInt(splitdate[0], 10);
        const month = parseInt(splitdate[1], 10);
        const year = parseInt(splitdate[2], 10);
        const listofdays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        // have to deal with leap years
        if (month !== 2) {
          if (day <= listofdays[month - 1]) {
            validdate = true;
          }
        } else if ((year % 4) !== 0) {
          if (day <= 28) {
            validdate = true;
          }
        } else if (day <= 29) {
          validdate = true;
        }
      }
      // only carry out post if valid date and valid password and all fields filled
      if (validpassword && validdate && datapresent) {
        const response = await fetch('/events',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `accesstoken=${accesstoken}&date=${date}&title=${title}&place=${place}&description=${description}`,
          });
        if (!response.ok) {
          throw new Error(`problem adding event${response.code}`);
        }
        // Have it so that if values are successfully posted form is wiped
        document.getElementById('Date').value = '';
        document.getElementById('Title').value = '';
        document.getElementById('Place').value = '';
        document.getElementById('Description').value = '';
        document.getElementById('Password').value = '';
      } else {
        // relevant error messages
        if (validpassword === false) {
          errorhtml += "<p style='color:red;'>Invalid Password</p>";
        }
        if (validdate === false) {
          errorhtml += "<p style='color:red;'>Invalid Date</p>";
        }
        if (title === '') {
          errorhtml += "<p style='color:red;'>No Title Entered</p>";
        }
        if (place === '') {
          errorhtml += "<p style='color:red;'>No Place Entered</p>";
        }
        if (description === '') {
          errorhtml += "<p style='color:red;'>No Description Entered</p>";
        }
      }
      // Updating errors
      document.getElementById('ErrorSection').innerHTML = errorhtml;
    } catch (error) {
      alert(`problem: ${error}`);
    }
  });
};
