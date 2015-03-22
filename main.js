var emi_detail = {};
function calculate_details (principal, rate, emi, month) {
	var monthly_interest = Math.round((principal*rate)/1200);
	if (monthly_interest >= emi) {
		alert("Something wrong happened !!");
		return;
	}
	if (principal < emi) {
		emi = principal + monthly_interest;
	}
	var effective_emi = emi - monthly_interest;
	principal -= effective_emi;
	var node = get_new_node(month, emi, monthly_interest, effective_emi, principal);
	append(node);
	if (principal > 0)
		calculate_details(principal, rate, emi, month + 1);
}

function prepare_emi() {
	refresh(1);
	emi_detail.initial_principal = new Number(document.getElementById('principal').value);
	emi_detail.rate = new Number(document.getElementById('rate').value);
	emi_detail.initial_emi = new Number(document.getElementById('emi').value);
	var monthly_interest = Math.round((emi_detail.initial_principal*emi_detail.rate)/1200);
	if (monthly_interest >= emi_detail.initial_emi) {
		alert("Emi should be more than " + monthly_interest + " in this case");
		return false;
	}
	calculate_details(emi_detail.initial_principal, emi_detail.rate, emi_detail.initial_emi, 1);
	show_results();
}

function get_new_node(id, emi, interest, effective_emi, principal) {
	var node = document.getElementById('to-clone').cloneNode(true);
	node.hidden = false;
	node.id = "";
	node.children[0].innerHTML = id;
	node.children[2].innerHTML = interest;
	node.children[3].innerHTML = effective_emi;
	node.children[4].innerHTML = principal;
	node.children[1].children[0].setAttribute("value", emi);
	node.onchange = recalculate_emi;
	return node;
}

function append(node) {
	document.getElementById('table-container').appendChild(node);
}

function refresh(n) {
	emi_detail = {};
	emi_detail.initial_principal = new Number(document.getElementById('principal').value);
	emi_detail.rate = new Number(document.getElementById('rate').value);
	emi_detail.initial_emi = new Number(document.getElementById('emi').value);
	emi_detail.total_interest = 0;
	emi_detail.month_count = 0;
	emi_detail.total_payment = 0;
	var table = document.getElementById('table-container');
	for (var i = table.children.length - 1; i > n; i--) {
		table.removeChild(table.children[i]);
	};
}

function show_results() {
	var results_node = document.getElementById('results');
	results_node.hidden = false;
	emi_detail.total_interest = 0;
	emi_detail.total_payment = 0;

	var table = document.getElementById('table-container');
	for (var i = table.children.length - 1; i > 1; i--) {
		emi_detail.total_interest += parseInt(table.children[i].children[2].innerHTML);
		emi_detail.total_payment += parseInt(table.children[i].children[1].children[0].value);
	};
	emi_detail.month_count = table.children.length - 2;
	document.getElementById('result_principal').innerHTML = emi_detail.initial_principal;
	document.getElementById('result_rate').innerHTML = emi_detail.rate;
	document.getElementById('result_interest_paid').innerHTML = emi_detail.total_interest;
	document.getElementById('result_total_amount').innerHTML = emi_detail.total_payment;
	document.getElementById('result_duration').innerHTML = emi_detail.month_count;
}

function recalculate_emi() {
	var id = parseInt(this.children[0].innerHTML);
	var new_emi = parseInt(this.children[1].children[0].value);
	if (new_emi < emi_detail.initial_emi) {
		alert("You can not reduce monthly emi!!");
		return;
	}
	var interest = parseInt(this.children[2].innerHTML);
	var new_effective_emi = new_emi - interest;
	var prev_principal = parseInt(this.previousElementSibling.children[4].innerHTML);
	var new_principal = prev_principal - new_effective_emi;
	if (new_principal < 0) {
		new_principal = 0;
		new_effective_emi = prev_principal;
		new_emi = new_effective_emi + interest;
	}
	refresh(id + 1);

	var table = document.getElementById('table-container');
	table.removeChild(this);
	table.appendChild(get_new_node(id, new_emi, interest, new_effective_emi, new_principal));
	if (new_principal > 0)
		calculate_details(new_principal, emi_detail.rate, emi_detail.initial_emi, id + 1);
	show_results();
}