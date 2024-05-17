var xhr = new XMLHttpRequest();
xhr.withCredentials = true;

xhr.addEventListener("readystatechange", function() {
  if(this.readyState === 4) {
    console.log(this.responseText);
  }
});

xhr.open("GET", "https://www.bungie.net/Platform/Destiny2/3/Profile/4611686018498334276/LinkedProfiles");
xhr.setRequestHeader("X-API-Key", "b6adb702442c4d5bb9ffa7cb80c8078b");
// WARNING: Cookies will be stripped away by the browser before sending the request.
xhr.setRequestHeader("Cookie", "__cflb=0H28vP5GxS7vgVH4MZTBhy81sdnGtwd37x1Zn2coNDq");

xhr.send();