$(document).ready(() => {

	/******************/
	/*** START CHAT ***/
	/******************/

	// Set user name
	var $userName = "Test";
	var $signedOn = 0;

	// Start chatbox
	$("#form-start").on("submit", (event) => {
		event.preventDefault();
		$userName = $("#username").val();
		$("#landing").slideUp(300);
		setTimeout(() => {
			$("#start-chat").html("Continue chat")
		}, 300);
		// Say howdy first
		if ($signedOn == 0) {
			postBotReply(`Howdy ${$userName}!`);
			postBotReply(`What's up?`);
			$signedOn = 1;
		}
	});

	/*****************/
	/*** USER CHAT ***/
	/*****************/

	// Post a message to the board
	function $postMessage() {
		$("#message").find("br").remove();
		var $message = $("#message").html().trim(); // get text from text box
		$message = $message.replace(/<div>/, "<br>").replace(/<div>/g, "").replace(/<\/div>/g, "<br>").replace(/<br>/g, " ").trim();
		if ($message) { // if text is not empty
			const html = `<div class="post post-user">${$message + timeStamp()}</span></div>`; // convert post to html
			$("#message-board").append(html); // add post to board
			$scrollDown(); // stay at bottom of chat
			botReply($message);
		};
		$("#message").empty();
	};

	// Chat input
	$("#message").on("keyup", (event) => {
		if (event.which === 13) $postMessage(); // Use enter to send
	}).on("focus", () => {
		$("#message").addClass("focus");
	}).on("blur", () => {
		$("#message").removeClass("focus");
	});
	$("#btnSend").on("click", $postMessage);

	/**********************/
	/*** AUTO REPLY BOT ***/
	/**********************/

	function botReply(userMessage) {
		const reply = generateReply(userMessage);
		if (typeof reply === "string") postBotReply(reply);
		else reply.forEach((str) => postBotReply(str));
	};

	function generateReply(userMessage) {
		const message = userMessage.toLowerCase();
		var reply = [`Sorry, I don't understand you.`, `Please try again`];

		// Generate some different replies
		if (/^hi$|^hell?o|^howdy|^hoi|^hola|^hey|^oi|^ola/.test(message)) reply = [`Yes, hi ${$userName}.`, `What can I do for you?`];
		else if (/test/.test(message)) reply = [`Ok.`, `Feel free to test as much as you want.`];
		else if (/help|sos|emergency|support/.test(message)) reply = [`I am here to help.`, `What seems to be the problem?`];
		else if (/class\=\"fa/.test(message)) reply = [`I see you've found the smileys.`, `Cool! <span class="far fa-grin-beam fa-2x"></span>`, `Did you need something?`];
		else if (/wtf|huh|how|what|why/.test(message)) reply = userMessage + " what?";
		else if (/huh+|boring|lame|wtf|pff/.test(message)) reply = [`<span class="far fa-dizzy fa-2x"></span>`, `I'm sorry you feel that way.`, `How can I make it better?`];
		else if (/bye|ciao|adios|adieu|salu/.test(message)) reply = [`Ok, bye! :)`];
		else if (/ha|haha+|jaja+|lol+/.test(message)) reply = [`LOL! <span class="far fa-grin-squint-tears fa-2x"></span>`, `So funny.`];

		return reply;
	};

	function postBotReply(reply) {
		const html = `<div class="post post-bot">${reply + timeStamp()}</div>`;
		const timeTyping = 500 + Math.floor(Math.random() * 2000);
		$("#message-board").append(html);
		$scrollDown();
	};

	/******************/
	/*** TIMESTAMPS ***/
	/******************/

	function timeStamp() {
		const timestamp = new Date();
		const hours = timestamp.getHours();
		var minutes = timestamp.getMinutes();
		if (minutes < 10) minutes = "0" + minutes;
		const html = `<span class="timestamp">${hours}:${minutes}</span>`;
		return html;
	};

	/***************/
	/*** CHAT UI ***/
	/***************/

	// Back arrow button
	$("#back-button").on("click", () => {
		$("#landing").show();
	});


	// Menu - navigation
	$("#nav-icon").on("click", () => {
		$("#nav-container").show();
	});

	$("#nav-container").on("mouseleave", () => {
		$("#nav-container").hide();
	});

	$(".nav-link").on("click", () => {
		$("#nav-container").slideToggle(200);
	});

	// Clear history
	$("#clear-history").on("click", () => {
		$("#message-board").empty();
		$("#message").empty();
	});

	// Sign out
	$("#sign-out").on("click", () => {
		$("#message-board").empty();
		$("#message").empty();
		$("#landing").show();
		$("#username").val("");
		$("#start-chat").html("Start chat");
		$signedOn = 0;
	});

	/*********************/
	/*** SCROLL TO END ***/
	/*********************/

	function $scrollDown() {
		const $container = $("#message-board");
		const $maxHeight = $container.height();
		const $scrollHeight = $container[0].scrollHeight;
		if ($scrollHeight > $maxHeight) $container.scrollTop($scrollHeight);
	}

	/***************/
	/*** EMOJIS ***/
	/***************/

	// Toggle Emojis
	$("#btnEmoji").on("click", () => {
		$("#divEmoji").slideToggle(300);
		$("#btnEmoji").toggleClass("fa fa-grin far fa-chevron-down");
	});

	// add emoiji to message
	$(".smiley").on("click", (event) => {
		const $smiley = $(event.currentTarget).clone().contents().addClass("fa-lg");
		$("#message").append($smiley);
		$("#message").select(); // ==> BUG: message field not selected after adding smiley !! 
	});
});
