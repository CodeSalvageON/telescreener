document.addEventListener('contextmenu', function (event) {
  event.preventDefault();
});

const blink_speed = 1000; 
const blink = setInterval(function () {
  const ele = document.getElementById('warning');
    ele.style.visibility = (ele.style.visibility == 'hidden' ? '' : 'hidden');
}, blink_speed);

$("#flag-1").click(function () {
  $("#flag-1").slideUp(2000);

  setTimeout(function () {
    $("#glass-1").slideDown(2000);
  }, 2000);
});

$("#continue").click(function () {
  $("#glass-1").slideUp(2000);

  setTimeout(function () {
    $("#glass-2").slideDown(2000);
  }, 2000);
});

$("#enter-code").click(function () {
  $("#glass-1").slideUp(2000);

  setTimeout(function () {
    $("#glass-3").slideDown(2000);
  }, 2000);
});

$("#normie-form").submit(function () {
  event.preventDefault();

  fetch("/msg", {
    method : "POST",
    headers : {
      "Content-Type" : "application/json"
    },
    body : JSON.stringify({
      username : document.getElementById("display_name").value,
      email : document.getElementById("email").value,
      comment : document.getElementById("comment").value
    })
  })
  .then(response => response.text())
  .then(data => {
    console.log(data);

    document.getElementById("display_name").value = "";
    document.getElementById("email").value = "";
    document.getElementById("comment").value = "";

    $("#glass-2").slideUp(2000);

    setTimeout(function () {
      $("#glass-5").slideDown(2000);
    }, 2000);
  })
  .catch(error => {
    throw error;
  });
});

$("#cmdr-form").submit(function () {
  event.preventDefault();

  fetch ("/cmdr", {
    method : "POST",
    headers : {
      "Content-Type" : "application/json"
    },
    body : JSON.stringify({
      cmdr_key : document.getElementById("cmdr_key").value
    })
  })
  .then(response => response.text())
  .then(data => {
    if (data === "wrong_code") {
      localStorage.setItem("telescreener_stat", "forbidden");

      window.close();
    }

    else {
      console.log(data);

      $("#glass-3").slideUp(2000);

      setTimeout(function () {
        $("#glass-4").slideDown(2000);
      }, 2000);
    }
  })
  .catch(error => {
    throw error;
  });
});

$("#commodore-form").submit(function () {
  event.preventDefault();

  fetch("/msg", {
    method : "POST",
    headers : {
      "Content-Type" : "application/json"
    },
    body : JSON.stringify({
      username : document.getElementById("cmdr_display_name").value,
      email : "COMMODORE",
      comment : document.getElementById("cmdr_comment").value
    })
  })
  .then(response => response.text())
  .then(data => {
    console.log(data);

    document.getElementById("cmdr_display_name").value = "";
    document.getElementById("cmdr_comment").value = "";

    $("#glass-4").slideUp(2000);

    setTimeout(function () {
      $("#glass-5").slideDown(2000);
    }, 2000);
  })
  .catch(error => {
    throw error;
  });
});

$("#glass-1").hide();
$("#glass-2").hide();
$("#glass-3").hide();
$("#glass-4").hide();
$("#glass-5").hide();

if (localStorage.getItem("telescreener_stat") === "forbidden") {
  window.close();
}