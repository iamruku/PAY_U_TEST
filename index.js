function controller() {
	var cardValidationModel = {
		VISA: {
			cardPattern: /^4/,
			cardNumberLength: 16,
			cvv: 'required',
			cvvLength: 3,
			displayText: 'Visa'
		},
		MASTERCARD: {
			cardPattern: /^5[1-5]/,
			cardNumberLength: 16,
			cvv: 'required',
			cvvLength: 3,
			displayText: 'Master'
		},
		MAESTRO: {
			cardPattern: /^(50|63|66|5[6-8]|6[8-9]|600[0-9]|6010|601[2-9]|60[2-9]|61|620|621|6220|6221[0-1])/,
			cardNumberLength: 19,
			cvv: 'optional',
			cvvLength: 4,
			displayText: 'Maestro'
		}
	};

	var savedCardsModel = [
		{
			number: '1234-5678-9009-8765',
			expiry: '02/22',
			type: 'VISA'
		},
		{
			number: '0987-6543-2112-345',
			expiry: '02/26',
			type: 'MASTERCARD'
		}
	];

	var savedCardsContainer = document.getElementById('id-existing-cards');
	var createNewButton = document.getElementById('id-create-card');
	var createNewCardForm = document.getElementById('id-create-card-form');
	var inputNumber = document.getElementById('id-number');
	var inputMonth = document.getElementById('id-month');
	var inputYear = document.getElementById('id-year');
	var inputCVV = document.getElementById('id-cvv');
	var numberError = document.getElementById('id-number-error');
	var monthError = document.getElementById('id-month-error');
	var yearError = document.getElementById('id-year-error');
	var cvvError = document.getElementById('id-cvv-error');

	var currentCard = {
		type: undefined,
		cvvRequired: false,
		cvvLength: undefined,
		length: undefined
	};

	createNewButton.addEventListener('click', function() {
		createNewCardForm.style.display = 'block';
	});

	inputNumber.addEventListener('input', function(e) {
		var value = e.target.value;

		if (value.length < 3) {
			currentCard = {
				type: undefined,
				cvvRequired: false,
				cvvLength: undefined,
				length: undefined
			};
		}

		if (!value) {
			numberError.innerHTML = 'Please enter card number';
		}

		//check card type
		if (!currentCard.type && value.length >= 3) {
			var visaRegex = new RegExp(cardValidationModel.VISA.cardPattern);
			var mastercardRegex = new RegExp(
				cardValidationModel.MASTERCARD.cardPattern
			);
			var maestroRegex = new RegExp(cardValidationModel.MAESTRO.cardPattern);
			if (visaRegex.test(value)) {
				currentCard.type = 'VISA';
				currentCard.cvvRequired =
					cardValidationModel.VISA.cvv === 'required' ? true : false;
				currentCard.cvvLength = cardValidationModel.VISA.cvvLength;
				currentCard.length = cardValidationModel.VISA.cardNumberLength;
			} else if (mastercardRegex.test(value)) {
				currentCard.type = 'MASTERCARD';
				currentCard.cvvRequired =
					cardValidationModel.MASTERCARD.cvv === 'required' ? true : false;
				currentCard.cvvLength = cardValidationModel.MASTERCARD.cvvLength;
				currentCard.length = cardValidationModel.MASTERCARD.cardNumberLength;
			} else if (maestroRegex.test(value)) {
				currentCard.type = 'MAESTRO';
				currentCard.cvvRequired =
					cardValidationModel.MAESTRO.cvv === 'required' ? true : false;
				currentCard.cvvLength = cardValidationModel.MAESTRO.cvvLength;
				currentCard.length = cardValidationModel.MAESTRO.cardNumberLength;
			}
		}
	});

	createNewCardForm.addEventListener('submit', function(e) {
		e.preventDefault();
		numberError.innerHTML = '';
		monthError.innerHTML = '';
		yearError.innerHTML = '';
		cvvError.innerHTML = '';

		var number = inputNumber.value;
		var month = inputMonth.value;
		var year = inputYear.value;
		var cvv = inputCVV.value;

		var hasError = false;

		if (!currentCard.type) {
			if (!number || number.length < 3) {
				numberError.innerHTML = 'Please enter card number';
			}
			hasError = true;
		} else {
			if (number.length !== currentCard.length) {
				numberError.innerHTML =
					'Card number must contain ' + currentCard.length + ' digits';
				hasError = true;
			}
			if (!month) {
				monthError.innerHTML = 'Select Month';
				hasError = true;
			}
			if (!year) {
				yearError.innerHTML = 'Select Year';
				hasError = true;
			}
			if (
				(currentCard.cvvRequired && !cvv) ||
				(cvv.length > 0 && cvv.length !== currentCard.cvvLength)
			) {
				cvvError = 'CVV must be ' + currentCard.cvvLength + ' digits long';
				hasError = true;
			}
		}
		if (hasError) {
			return false;
		}

		savedCardsModel.push({
			number: chunk(number, 4).join('-'),
			expiry: month + '/' + year,
			type: currentCard.type
		});

		renderSavedCards(savedCardsModel, savedCardsContainer);
		createNewCardForm.style.display = 'none';
	});

	// render the saved cards
	renderSavedCards(savedCardsModel, savedCardsContainer);
}

function createElement(type, className, id) {
	var elem = document.createElement(type);
	if (className) {
		elem.setAttribute('class', className);
	}
	if (id) {
		elem.setAttribute('class', id);
	}
	return elem;
}

function renderSavedCards(savedCardsModel, savedCardsContainer) {
	savedCardsContainer.innerHTML = '';
	savedCardsModel.map(function(element, index) {
		var cardContainer = createElement('div', 'cls-card');

		var editIcon = createElement('i', 'fa fa-pencil');
		editIcon.innerHTML = '&nbsp;';
		var editText = document.createTextNode('Edit');
		var cardEdit = createElement('div', 'cls-card-edit');
		cardEdit.appendChild(editIcon);
		cardEdit.appendChild(editText);
		cardContainer.appendChild(cardEdit);

		var cardNumber = createElement('div', 'cls-card-number');
		cardNumber.innerHTML = element.number;
		cardContainer.appendChild(cardNumber);

		var cardExpire = createElement('div', 'cls-card-expiry');
		var valid = createElement('span');
		valid.innerHTML = 'Valid Thru&nbsp;';
		var validity = createElement('span');
		validity.innerHTML = element.expiry;
		cardExpire.appendChild(valid);
		cardExpire.appendChild(validity);
		cardContainer.appendChild(cardExpire);

		var cardType = createElement('div', 'cls-card-icon');
		var type = '';
		switch (element.type) {
			case 'VISA':
				type = 'fa fa-cc-visa';
				break;
			case 'MASTERCARD':
				type = 'fa fa-cc-mastercard';
				break;
			case 'MAESTRO':
				type = 'fa fa-maxcdn';
			default:
				type = '';
		}
		var icon = createElement('i', type);
		cardType.appendChild(icon);
		cardContainer.appendChild(cardType);

		savedCardsContainer.appendChild(cardContainer);
	});
}

function chunk(str, n) {
	var ret = [];
	var i;
	var len;

	for (i = 0, len = str.length; i < len; i += n) {
		ret.push(str.substr(i, n));
	}

	return ret;
}

document.addEventListener('DOMContentLoaded', controller, false);
