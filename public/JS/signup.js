const role = document.getElementById('role')

const roleValue = localStorage.getItem('role')

if (roleValue) {
  if (roleValue == "user") {
    role[1].setAttribute('selected', 'selected')
  } else if (roleValue == "worker") {
    role[2].setAttribute('selected', 'selected')
  } else {
    role[0].setAttribute('selected', 'selected')
  }
}




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

  const districtsList = document.querySelector('.districts');
  const upazilaList = document.querySelector('.upazilla');
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
      document.querySelector('.districts').onclick = function () {
        dindex = document.querySelector('.districts').value

        const allUpazilla = districts.data;
        allUpazilla.forEach(upazilla => {
          if (dindex == upazilla.district) {

            upa = upazilla.upazilla;
            for (let i = 0; i < upa.length; i++) {
              const li = document.createElement("option");
              li.textContent = upa[i];

              const att = document.createAttribute("value");
              att.value = upa[i];

              upazilaList.append(li);
            }
          }
        })
      }
    })
    .catch(error => {
      console.error('Error::', error);
    });
}

