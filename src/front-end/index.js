




//register button
$(function(){
$("#daformreg").submit((event)=>{
  event.preventDefault();
  console.log('can you hear me register button')
  const username= $('#reguser').val();
  const password= $('#regpass').val();
  const firstName= $('#regfirst').val();
  const lastName= $('#reglast').val();

  console.log(username)
  console.log(lastName)
    $.ajax({
        url: '/api/user',
        type:"POST",
        data: {
          username:username,
          password:password,
          firstName:firstName,
          lastName:lastName
        },
        success: function(response){
          console.log(JSON.stringify(response))
          if(response){
            $('#reguser').val('');
            $('#regpass').val('');
            $('#regfirst').val('');
            $('#reglast').val('');
          }
  },
  error:(err)=>{
    console.log(JSON.stringify(err) + 'this be de eerrrrooorrrrr')
        }
      });
    });
  })








//login button
$(function(){
  var $loginForm = $("#daformlog");
  console.log({ $loginForm });
$loginForm.submit(function(event){
  console.log('submitted');
  event.preventDefault();
  console.log('can you hear me register button')
  const username= $('#loguser').val();
  const password= $('#logpass').val();

  $.ajax({
    url: `/api/login`,
    type:"POST",
    data: {
      username:username,
      password:password
    },
    success: function(response){
      if(response){
        $('#loguser').val(" ");
        $('#logpass').val(" ");
      }
    },
  error: (error)=>{
    console.log(JSON.stringify(err) + 'this be the eerrrrooorrrrr')
  }

  });

  })
})



// Get button  -- Problem is multiple gets
$(function(){
$("#formget").submit(function(event){
  event.preventDefault();
  console.log('can you hear me GET button')
  let queryTarget= $(event.currentTarget).find('#mytest');
  let findings = queryTarget.val();
  console.log(`-${findings}-`);
  // postApiData(findings);
  getApiData(findings);
  console.log(findings)
  queryTarget.val(" ");
  })
})


//GET Ajax
function getApiData(data){
  console.log(`-${data}-`);
  $.ajax({
    url:`/api/city-reviews/${data}`,
    type:"GET",
    success:function(data){
      console.log(data)
          renderGetData(data);
    },
    dataType:"json",
    contentType:"application/json"
  });
}

//Render GET html
function renderGetData(data){
  console.log(data)
let html1 =

`<h1 class='noteTitle'>${data.name}</h1>
<h3>Pros</h3>
<p class='notepro'>${data.pros[0]}</p>
<h3>Cons</h3>
<p class='notecon'>${data.cons}</p>
<button class='update-but'>Update</button>
<button class='delete-but'>Delete</button>`



  $('#getnotes').html(html1)
}





//Post button
$(function(){
$("#formpost").submit(function(event){
  event.preventDefault();
  // console.log('can you hear me post button')
  let queryTarget= $(event.currentTarget).find('#procons');
  let findings = queryTarget.val();
  postApiData(findings);


  queryTarget.val(" ");
  })
})


//Post AJAX

function postApiData(data){
  console.log(data)
$.ajax({
  url: `/api/city-reviews`,
  type:"POST",
  data: JSON.stringify({data}),
  success: function(data){
    console.log(data)
  },
  dataType: "json",
  contentType: "application/json"

})
error: (error)=>{
  console.log('it went down in ERRORRRR post')
};

}
