

$(function () {
    $("#upload_link").on('click', function (e) {
        e.preventDefault();
        $("#uploadPic:hidden").trigger('click');
    });
}
);

$('#uploadPic').on('change', function () {
    const [file] = $('#uploadPic').prop('files')
    if (file) {
        $('#profilePic').prop('src', URL.createObjectURL(file));
    }
})

$('#removePic').on('click', function () {
    $('#uploadPic').val(null);
    $('#profilePic').prop('src', '');
})


// Function to fetch data from the API
async function fetchData() {
    try {
        const response = await fetch('https://countriesnow.space/api/v0.1/countries/states'); // Replace with your API endpoint
        const { data } = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}

// Function to populate the select element with options
document.getElementById('mySelect').addEventListener('click',
    // Call the function to populate the select on page load
    populateSelect, { once: true }
)
async function populateSelect(e) {
    e.preventDefault();
    const selectElement = document.getElementById('mySelect');
    const options = await fetchData();
    console.log(options)
    // Clear any existing options
    selectElement.innerHTML = `<option value=0>Select an option</option>`;

    // Populate the select with new options
    options.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option.name;
        optionElement.textContent = option.name;
        selectElement.appendChild(optionElement);
    });
}

let curPass = document.getElementById('currentPassword');
let pass = document.getElementById('yourPassword');
let confirmPass = document.getElementById('yourConfirmPassword');
function toggleShowPassword() {
    let curType = curPass.getAttribute('type') === 'password' ? 'text' : 'password';
    curPass.setAttribute('type', curType);

    let type = pass.getAttribute('type') === 'password' ? 'text' : 'password';
    pass.setAttribute('type', type);

    let confirmtype =
        confirmPass.getAttribute('type') === 'password' ? 'text' : 'password';
    confirmPass.setAttribute('type', confirmtype);
}
function checkPassword() {
    let errMsg = '';
    if (
        //password validation ...
        !pass.value.match(
            `(?=[A-Za-z0-9@#$%^&+!=]+$)^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$%^&+!=])(?=.{8,}).*$`
        )
    ) {
        errMsg =
            'New Password must have atleast 8+ length, one upper, one lower, one numeric and one special character(@#$%^&+!=) .';
    } else if (pass.value !== confirmPass.value) {
        errMsg = 'Password does not match ...';
    }

    if (errMsg) {
        new Noty({
            layout: 'topRight',
            theme: 'metroui',
            type: 'error',
            text: errMsg,
            timeout: 5000,
        }).show();
        return false;
    }
}





