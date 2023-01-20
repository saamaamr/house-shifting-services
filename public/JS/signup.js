const divisionsList = document.querySelector('.divisions');
const endPoint2 = "https://bdapis.com/api/v1.1/divisions";
async function bdApi(url) {
  const res = await fetch(url)
  return res.json();
}
bdApi(endPoint2)
  .then(divisions => {
    const allDivisions = divisions.data;

    allDivisions.forEach(division => {
      const li = document.createElement("option");
      li.textContent = division.division;
      const att = document.createAttribute("value");
      att.value = division.division;
      divisionsList.append(li);
    })
  })
  .catch(error => {
    console.error('Error:', error);
  });
const test = document.getElementById("division")
test.onclick = function () {
  dist = document.getElementById("division").value
  var list = document.getElementById("districts").getElementsByTagName("option");
  for (var k = list.length - 1; k >= 1; k--) {
    var item = list[k];
    item.parentNode.removeChild(item);
  }
  const districtsList = document.querySelector('.districts');
  const endPoint = `https://bdapis.com/api/v1.1/division/${dist}`;
  async function bdApi(url) {
    const res = await fetch(url)
    return res.json();
  }
  bdApi(endPoint)
    .then(districts => {
      const allDistricts = districts.data;
      allDistricts.forEach(district => {
        const li = document.createElement("option");
        li.textContent = district.district;
        const att = document.createAttribute("value");
        att.value = district.district;
        districtsList.append(li);
      })
    })
    .catch(error => {
      console.error('Error::', error);
    });
}
