$(document).ready(function () {
	$('#pwdForm').submit(function (e) {
		e.preventDefault();
	
		const submitBtn = $('#submitBtn');
		const formMsg = $('#formMsg');

		const oldPassword = $('#oldPassword').val()?.trim();
		const newPassword = $('#newPassword').val()?.trim();
		const confirmPw = $('#confirmPw').val()?.trim();


		const strengthPwRegex =
			/^(?=.*[A-Z])(?=.*[!&%\/()=\?\^\*\+\]\[#><;:,\._-|@])(?=.*[0-9])(?=.*[a-z]).{6,40}$/;
		if (!strengthPwRegex.test(newPassword)) {
			return formMsg.text(
				'Mật khẩu từ 6-40 ký tự, ít nhất 1 ký tự số, 1 ký tự thường, 1 ký tự hoa'
			);
		}
		//new password must different from old password
		this.submit();
		// confirm password
		if (newPassword !== confirmPw) {
			return formMsg.text('Xác nhận mật khẩu không trùng khớp');
		}
		this.submit();
	});
});
