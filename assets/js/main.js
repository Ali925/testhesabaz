var arrayData = {
	todosDate: [],
	usersData: [],
	commentsData: []
};
$(document).ready(function(){
	
	$.ajax({
		url: "https://jsonplaceholder.typicode.com/todos",
		method: "GET"
	}).done(function(todos){
		arrayData.todosData = todos;
		$.ajax({
			url: "https://jsonplaceholder.typicode.com/users",
			method: "GET"
		}).done(function(users){
			arrayData.usersData = users;
			$.ajax({
				url: "https://jsonplaceholder.typicode.com/comments",
				method: "GET"
			}).done(function(comments){
				arrayData.commentsData = comments;
				setupCarousel('#accountData', todos.map(function(val, i){return {title: val.title};}));
				setupCarousel('#numbersData', users.map(function(val , i){return {name: val.name, email: val.email};}));
				setupTable('#todoTable', todos.map(function(val, i){return {id: val.id, title: val.title, completed: val.completed};}));
				setupTable('#commentsTable', comments.map(function(val, i){return {id: val.id, postId: val.postId, name: val.name, email: val.email};}));
			});
			
		});
		
	});
	
	$(".number-table th > a").click(function(){
		var sort = $(this).data("name"), arrName = $(this).data("arr"), id = "#" + $(this).parent().parent().parent().parent().parent().parent(".number-table-box")[0].id;
		if($(this).hasClass("active")){
			$(this).removeClass("active");
			sort = "-" + sort;
		} else{
			$(this).addClass("active");
		}
		var sortedArr = arrayData[arrName].sort(dynamicSort(sort));
		if(sortedArr[0].postId)
			sortedArr = sortedArr.map(function(val, i){return {id: val.id, postId: val.postId, name: val.name, email: val.email};});
		else
			sortedArr = sortedArr.map(function(val, i){return {id: val.id, title: val.title, completed: val.completed};});
		$(this).parent().parent().parent("tbody").find("tr:not(:first-child)").remove();
		
		setupTable(id, sortedArr);
	});
	
});

function setupCarousel(id, data){
	var temp = "";
	for(var d in data){
		temp += "<div class='carousel-el item'>";
		for(var e in data[d]){
			temp += "<span>" + data[d][e] + "</span>";
		}
		temp += "</div>";
	}
	
	$(id).html(temp);
	
	$(id).owlCarousel({nav: true, margin: 23,autoWidth:true});
}

function setupTable(id, data){
	var temp = "";
	for(var d in data){
		temp += "<tr>";
		for(var e in data[d]){
			temp += "<td>" + data[d][e] + "</td>";
		}
		temp += "</tr><tr class='line'></tr>";
	}

	//console.log(temp);
	$(id + " table > tbody").append(temp);
}

function dynamicSort(property) {
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a,b) {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}