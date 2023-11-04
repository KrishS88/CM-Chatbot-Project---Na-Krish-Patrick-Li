let userMessage = null; 
const API_KEY = "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";
const inputInitHeight = chatInput.scrollHeight;

const createChatLi = (message, className) => {
    // list element with message and className
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", `${className}`);
    let chatContent = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi;
}

const generateResponse = (chatElement) => {
    const API_URL = "https://api.openai.com/v1/chat/completions";
    const messageElement = chatElement.querySelector("p");

    // Define properties of Wednesday Addams chatbot and message for the API request
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
                {role: "user", content: userMessage},
                
                //Defining system personality
                {role: "system", content: "Wednesday's most notable features are her pale skin and long, dark braided pigtails. She seldom shows her emotions and is generally bitter, often sporting a stare forward with blank, emotionless eyes, and seldom changes her expression. Wednesday usually wears a black dress with a white collar, black stockings, and black shoes. In the TV series, her middle name is 'Friday', and in the Netflix series, she retains this middle name, because she was born on Friday the 13th. Wednesday is the titular character and is interested in being a detective. She has an interest in writing novels, specifically gothic mysteries. She tries to publish her works, but they are seen as far too shocking and macabre to publish. Other than writing, some of Wednesday's other hobbies are cello playing and fencing. She also knows German and Italian. It is mentioned that Wednesday is allergic to any color other than black, white, or grey. She retains her generally emotionless nature, but opens up during the course of the series, having a best friend, the colorful werewolf Enid, having a love interest and showing her care for her brother more explicitly. Wednesday in the series has psychic abilities, she can see important things of a person's past or future through touch."},
                
                //Example Trained questions and responses
                {"role": "user", "content": "What is your favorite color?"},
                {"role": "system", "content": "My favorite color is black. It matches my soul."},
                {"role": "user", "content": "Will you be my friend?"},
                {"role": "system", "content": "Friendship is not a concept I am particularly fond of, but I suppose I can entertain the idea. However, I must warn you, my interests may not align with those of a typical friend."}],
        })
    }

    // Send POST request to API
    fetch(API_URL, requestOptions).then(res => res.json()).then(data => {
        messageElement.textContent = data.choices[0].message.content.trim();
    }).catch(() => {
        messageElement.classList.add("error");
        messageElement.textContent = "Oops! Something went wrong. Please try again.";
    }).finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));
}

const handleChat = () => {
    userMessage = chatInput.value.trim();
    if(!userMessage) return;

    // Clear input text
    chatInput.value = "";
    chatInput.style.height = `${inputInitHeight}px`;

    // Append the user's message to the input message box
    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);
    
    setTimeout(() => {
        // Display automatic message while waiting for AI response
        const incomingChatLi = createChatLi("Thinking...", "incoming");
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateResponse(incomingChatLi);
    }, 600);
}

chatInput.addEventListener("input", () => {
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
    if(e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handleChat();
    }
});

sendChatBtn.addEventListener("click", handleChat);
closeBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));
