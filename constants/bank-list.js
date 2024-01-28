const BANK_LIST = [
	{
		code: 'VCB',
		logoUrl: 'https://upload.wikimedia.org/wikipedia/vi/8/85/Vietcombank_Logo.png',
		name: 'Ngân hàng Ngoại thương Việt Nam – Vietcombank',
	}
];

module.exports = BANK_LIST.sort((a, b) =>
	a.code > b.code ? 1 : a.code < b.code ? -1 : 0
);
