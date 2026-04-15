
//   console.log("js loaded");
document.addEventListener("DOMContentLoaded", function () {
 
    
    const searchButton = document.getElementById("search-btn");
    const usernameInput = document.getElementById("user-input");
    const statsContainer = document.querySelector(".stats-container");
    const easyProgressCircle = document.querySelector(".easy-progress.circle");
    const mediumProgressCircle = document.querySelector(".medium-progress.circle");
    const hardProgressCircle = document.querySelector(".hard-progress.circle");
    const easyLabel = document.getElementById("easy-label");
    const mediumLabel = document.getElementById("medium-label");
    const hardLabel = document.getElementById("hard-label");
    const cardStatsContainer = document.querySelector(".stats-cards");
      
    
//    return true or false base on regularexpression
      function validateUsername(username) {
           if(username.trim() === "") {
            alert("Usename should not be empty");
            return false;
           }
           const regex = /^[a-zA-Z0-9_]+$/;
           const isMatching = regex.test(username);
           if(!isMatching) {
            alert("Invalid Username");
           }
           return isMatching;
        }

        async function fetchUserDetails(username) {
             
             try{
                searchButton.textContent = "Searching...";
                searchButton.disabled = true;
                

                const proxyUrl = 'http://cors-anywhere.herokuapp.com/';
                const targetUrl = 'https://leetcode.com/graphql/';
                //concatenated url:http://cors-anywhere.herokuapp.com/+https://leetcode.com/graphql/'
                
                const myHeaders = new Headers();
                myHeaders.append("content-type", "application/json");
             
             const graphql = JSON.stringify({
                query:  `
                query userSessionProgress($username: String!) {
                allQuestionsCount {
                difficulty
                count
             }
               matchedUser(username: $username) {
               submitStats {
                acSubmissionNum {
                 difficulty
                 count
                 submissions
          }
        }
      }
    }
  `,
  variables: { username }
});
            
                const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: graphql,
                redirect: "follow"
             };

             const response = await fetch(proxyUrl+targetUrl, requestOptions);
                if(!response.ok) {
                    throw new Error("Unable to fetch Details");
                }
                const parsedData = await response.json();
                console.log("Logging data: ", parsedData);

                displayUserData(parsedData);
             }
             catch(error){
               console.error("ACTUAL ERROR:", error);
                statsContainer.innerHTML = '<p>No data Found</p>';
             }
             finally {
               searchButton.textContent = "Search";
                searchButton.disabled = false;
             }
        }
          function updateProgress(solved, total, label, circle, type){
             const totalProgress = Math.min((solved / 500) * 100, 100);
              circle.style.background = `conic-gradient(
              #6b0509 ${totalProgress}%,
              #7e4704 ${totalProgress}% 
               )`;
             label.innerHTML = `
              <div>${type}</div>
              <div>${totalProgress.toFixed(1)}%</div>
              `;
             
          }


         function displayUserData(parsedData) {
       if (!parsedData?.data?.matchedUser) {
        statsContainer.innerHTML = "<p>No data found</p>";
        return;
    }
       

    const allQuestions = parsedData.data.allQuestionsCount;
    const solvedStats = parsedData.data.matchedUser.submitStats.acSubmissionNum;

    const totalEasyQues = allQuestions.find(q => q.difficulty === "Easy")?.count || 0;
    const totalMediumQues = allQuestions.find(q => q.difficulty === "Medium")?.count || 0;
    const totalHardQues = allQuestions.find(q => q.difficulty === "Hard")?.count || 0;

    const totalSolvedEasyQues = solvedStats.find(q => q.difficulty === "Easy")?.count || 0;
    const totalSolvedMediumQues = solvedStats.find(q => q.difficulty === "Medium")?.count || 0;
    const totalSolvedHardQues = solvedStats.find(q => q.difficulty === "Hard")?.count || 0;

    updateProgress(totalSolvedEasyQues, totalEasyQues, easyLabel, easyProgressCircle, "Easy"); 
    updateProgress(totalSolvedMediumQues, totalMediumQues, mediumLabel, mediumProgressCircle , "Medium"); 
    updateProgress(totalSolvedHardQues, totalHardQues, hardLabel, hardProgressCircle, "Hard"); 

    //identify submission questions...
  const cardsData = [
  {
    label: "Total Solved Submission",
    value: solvedStats[0]?.count || 0
  },
  {
    label: "Easy Solved Submission",
    value: solvedStats.find(q => q.difficulty === "Easy")?.count || 0
  },
  {
    label: "Medium Solved Submission ",
    value: solvedStats.find(q => q.difficulty === "Medium")?.count || 0
  },
  {
    label: "Hard Solved Submission",
    value: solvedStats.find(q => q.difficulty === "Hard")?.count || 0
  }
];
     //for mapping the submission data....
    cardStatsContainer.innerHTML = cardsData.map(
      data =>{
         return `
               <div class="cards">
               <h4>${data.label}</h4>
               <p>${data.value}</p>
               </div>
         `
      }
       ).join("")
}


    searchButton.addEventListener("click", function () {
        const username = usernameInput.value;
        console.log("logging username:", username);
        if(validateUsername(username)) {
           fetchUserDetails(username);
        }
    });
    
});
