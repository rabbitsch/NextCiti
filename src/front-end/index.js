
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
        url: '/api/users',
        type:"POST",
        data: JSON.stringify({
          username:username,
          password:password,
          firstName:firstName,
          lastName:lastName
        }),
        success: function(response){
          console.log(JSON.stringify(response))
          if(response){
            $('#reguser').val('');
            $('#regpass').val('');
            $('#regfirst').val('');
            $('#reglast').val('');
          }
  },
      headers: {
    'Content-Type': 'application/json',
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
  console.log('login button pressed');
  event.preventDefault();
  const username= $('#loguser').val();
  const password= $('#logpass').val();

  $.ajax({
    url: `/api/login`,
    type:"POST",
    data:JSON.stringify({
      username:username,
      password:password
    }),
    success: function(response){
      console.log(response)
      sessionStorage.setItem('token', response.authToken);
      if(response){

        $('#loguser').val(" ");
        $('#logpass').val(" ");
      }
    },
    headers: {
      'Content-Type': 'application/json'
    },


  error: (error)=>{
    console.log(JSON.stringify(error) + 'this be the eerrrrooorrrrr')
  }

  });

  })
})



// Get button
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
  const name= $('#cityname').val();
  const pros= $('#pros').val();
  const cons= $('#cons').val();



$.ajax({
  url: `/api/city-reviews`,
  type:"POST",
  headers: {
    'Content-Type': 'application/json',
  },
  data: JSON.stringify({
    name:name,
    pros:pros,
    cons:cons
  }),
  success: function(response){
    console.log(JSON.stringify(response))
    if(response){
      $('#cityname').val(" ");
      $('#pros').val(" ");
      $('#cons').val(" ");

    }
  },
  error:(error)=>{
    console.log(JSON.stringify(error) + 'the post error man')
    }
      })
    });
  });




//drop down button functio
function myDropbutton() {
      document.getElementById("myDropdown").classList.toggle("show");


  // Close the dropdown menu if the user clicks outside of it
  window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {

      var dropdowns = document.getElementsByClassName("dropdown-content");
      var i;
      for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    }
  }
  };





// //Get All button
//   $(function(){
//   $("#formgetall").submit(function(event){
//     event.preventDefault();
//
//   //GET Ajax
//
//     $.ajax({
//       url:`/api/city-reviews`,
//       type:"GET",
//       success:function(data){
//         console.log(data)
//             renderGetallData(data);
//       },
//       dataType:"json",
//       contentType:"application/json"
//     });
//   })
// })
//
//
//   //Render GET html
//   function renderGetallData(data){
//     console.log(data)
//
//     let html = '<ul class="mynoteitems">'
//     data.forEach((value =>{
//       console.log(value)
//       html += `<li class="note-list">
//       <h1 class='notetitle'>${value.name}</h1>
//       <h3>Pros</h3>
//       <p class='notepro'>${value.pros}</p>
//       <h3>Cons</h3>
//       <p class='notecon'>${value.cons}</p>
//       <button class='update-but'>Update</button>
//       <button class='delete-but'>Delete</button>
//       </li>`
//
//     }))
//
//
//   html += '</ul>';
//   $("#getnotes").html(html);
//
// }


// Render Get all info
  $(function(){
  $("#homeward").click(function(event){
    console.log('can you hear me render button!!')
    event.preventDefault();
    $('#getnotes').hide();
    $('#containsAll').show();
    })
  })





// Get All and Render notes screen

$(function(){
$("#formgetall").submit(function(event){
  event.preventDefault();
  // $('#containsAll').hide();
//GET Ajax

  $.ajax({
    url:`/api/city-reviews`,
    type:"GET",
    success:function(data){
      console.log(data)
          renderGetallData(data);
    },
    dataType:"json",
    contentType:"application/json"
  });

  // $('#containsAll').html(renderGetallData());
})
})


//Render GET html
function renderGetallData(data){
  console.log(data)

  let html = '<ul class="mynoteitems">'
  data.forEach(value =>{
    console.log(value)
    html += `<li class="note-list">
    <form id='listForm'>
    <h1 class='notetitle'>${value.name}</h1>
    <h3>Pros</h3>
    <p class='notepro'>${value.pros}</p>
    <h3>Cons</h3>
    <p class='notecon'>${value.cons}</p>
    <button class='update-but'>Update</button>
    <button class='delete-but'>Delete</button>
    </form>
    </li>`

  })


html += '</ul>';
$('#containsAll').hide();
 $('#getnotes').html(html);
 $('#getnotes').show();

}





//update button
$(function(){
$(".update-but").click(function(event){
  event.preventDefault();
  // console.log('can you hear me post button')
  const name= $('#cityname').val();
  const pros= $('#pros').val();
  const cons= $('#cons').val();



$.ajax({
  url: `/api/city-reviews/${data}`,
  type:"PUT",
  headers: {
    'Content-Type': 'application/json',
  },
  data: JSON.stringify({
    name:name,
    pros:pros,
    cons:cons
  }),
  success: function(response){
    console.log(JSON.stringify(response))
    if(response){
      $('#cityname').val(" ");
      $('#pros').val(" ");
      $('#cons').val(" ");

    }
  },
  error:(error)=>{
    console.log(JSON.stringify(error) + 'the post error man')
    }
      })
    });
  });




//Delete Button
  $(function(){
  $(".delete-but").click(function(event){
    event.preventDefault();
    // console.log('can you hear me post button')
    const name= $('#cityname').val();
    const pros= $('#pros').val();
    const cons= $('#cons').val();



  $.ajax({
    url: `/api/city-reviews/${data}`,
    type:"DELETE",
    headers: {
      'Content-Type': 'application/json',
    },
    data: JSON.stringify({
      name:name,
      pros:pros,
      cons:cons
    }),
    success: function(response){
      console.log(JSON.stringify(response))
      if(response){
        $('#cityname').val(" ");
        $('#pros').val(" ");
        $('#cons').val(" ");

      }
    },
    error:(error)=>{
      console.log(JSON.stringify(error) + 'the post error man')
      }
        })
      });
    });
