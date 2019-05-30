import React, { Component } from 'react';
   import Pusher from 'pusher-js';
   import './App.css';

   class App extends Component {
     constructor(props) {
       super(props);
       this.state = {
         userMessage: '',
         conversation: [],
       };
     }

     componentDidMount() {
       const pusher = new Pusher('PUSHER_APP_ID', {
         cluster: 'mt1',
         encrypted: true,
       });

       const channel = pusher.subscribe('bot');
       channel.bind('bot-response', data => {
         const msg = {
           text: data.message,
           user: 'ai',
         };
         this.setState({
           conversation: [...this.state.conversation, msg],
         });
       });
     }

     handleChange = event => {
       this.setState({ userMessage: event.target.value });
     };

     handleSubmit = event => {
       event.preventDefault();
       if (!this.state.userMessage.trim()) return;

       const msg = {
         text: this.state.userMessage,
         user: 'human',
       };

       this.setState({
         conversation: [...this.state.conversation, msg],
       });

       fetch('http://localhost:5000/chat', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({
           message: this.state.userMessage,
         }),
       });

       this.setState({ userMessage: '' });
     };

     render() {
       const ChatBubble = (text, i, className) => {
         return (
           <div key={`${className}-${i}`} className={`${className} chat-bubble`}>
             <span className="chat-content">{text}</span>
           </div>
         );
       };

       const chat = this.state.conversation.map((e, index) =>
         ChatBubble(e.text, index, e.user)
       );

       return (
         <div>
           <h1>React Chatbot</h1>
           <div className="chat-window">
             <div className="conversation-view">{chat}</div>
             <div className="message-box">
               <form onSubmit={this.handleSubmit}>
                 <input
                   value={this.state.userMessage}
                   onInput={this.handleChange}
                   className="text-input"
                   type="text"
                   autoFocus
                   placeholder="Type your message and hit Enter to send"
                 />
               </form>
             </div>
           </div>
         </div>
       );
     }
   }

   export default App;

//
// <div class="wrapper">
//     <div class="sidebar">
//         <h2>Weatherbot</h2>
//         <p> Inspired to build upon what I learned at the Women Techmaker's International Women's Day workshop.
// 					<br>
// Building an AI chatbot with Dialogflow
// <br>
// Dialogflow + Socket.IO + Node JS + Bot UI
//
// Chatbot using Express.JS (Node.JS Framework) and Google's DialogFlow</p>
//     </div>
//     <div class="chat-container">
//         <div class="top-bar">
//             <div class="user-info"></div>
//         </div>
//         <div class="chat-window"></div>
//         <div class="bottom-bar"><input class="chat-input" type="text" placeholder="" /><button class="send-btn" id="send-btn" type="submit"><i class="material-icons">favorite</i></button></div>
//     </div>
// </div>
//
