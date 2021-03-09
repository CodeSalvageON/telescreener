document.addEventListener('contextmenu', function (event) {
  event.preventDefault();
});

function realTime () {
  fetch ('/thingy')
  .then(response => response.text())
  .then(data => {
    document.getElementById("realtime").innerHTML = data;
  })
  .catch (error => {
    throw error;
  });
}

setInterval(realTime, 500);