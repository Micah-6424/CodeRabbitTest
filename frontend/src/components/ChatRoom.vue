<template>
  <div class="chatroom">
    <h2>Chatroom</h2>
    <div class="messages">
      <div v-for="msg in messages" :key="msg.id" class="message">
        <strong>{{ msg.username }}:</strong> {{ msg.content }}
        <span class="timestamp">{{ new Date(msg.created_at).toLocaleTimeString() }}</span>
      </div>
    </div>
    <form @submit.prevent="sendMessage">
      <input v-model="username" placeholder="Your name" required />
      <input v-model="content" placeholder="Type a message..." required />
      <button type="submit">Send</button>
    </form>
  </div>
</template>

<script>
export default {
  name: 'ChatRoom',
  data() {
    return {
      messages: [],
      username: '',
      content: '',
      pollInterval: null,
    };
  },
  methods: {
    async fetchMessages() {
      const res = await fetch('http://localhost:3001/messages');
      this.messages = await res.json();
    },
    async sendMessage() {
      if (!this.username || !this.content) return;
      await fetch('http://localhost:3001/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: this.username, content: this.content })
      });
      this.content = '';
      this.fetchMessages();
    }
  },
  mounted() {
    this.fetchMessages();
    this.pollInterval = setInterval(this.fetchMessages, 2000);
  },
  beforeUnmount() {
    clearInterval(this.pollInterval);
  }
};
</script>

<style scoped>
.chatroom {
  max-width: 400px;
  margin: 2rem auto;
  border: 1.5px solid #7B2FF2;
  padding: 1.5rem;
  border-radius: 12px;
  background: linear-gradient(135deg, #f2f6ff 0%, #e0c3fc 100%);
  box-shadow: 0 4px 16px rgba(123, 47, 242, 0.08);
}
.messages {
  max-height: 300px;
  overflow-y: auto;
  margin-bottom: 1rem;
  background: #fff;
  border-radius: 8px;
  padding: 0.5rem;
  box-shadow: 0 2px 8px rgba(123, 47, 242, 0.04);
}
.message {
  margin-bottom: 0.5rem;
  background: #e9e4f0;
  border-radius: 6px;
  padding: 0.4rem 0.7rem;
  color: #3d246c;
  box-shadow: 0 1px 4px rgba(123, 47, 242, 0.06);
}
.timestamp {
  color: #7B2FF2;
  font-size: 0.8em;
  margin-left: 0.5em;
}
form {
  display: flex;
  gap: 0.5rem;
}
input {
  flex: 1;
  padding: 0.4rem;
  border: 1.5px solid #7B2FF2;
  border-radius: 6px;
  background: #f7f0ff;
  color: #3d246c;
  font-weight: 500;
}
input:focus-visible {
  border-color: #f953c6;
  background: #fff0f6;
  box-shadow: 0 0 0 2px #f953c6;
}
button {
  padding: 0.4rem 1.2rem;
  background: linear-gradient(90deg, #7B2FF2 0%, #f953c6 100%);
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 8px rgba(249, 83, 198, 0.08);
  transition: background 0.2s, box-shadow 0.2s;
}
button:hover {
  background: linear-gradient(90deg, #f953c6 0%, #7B2FF2 100%);
  box-shadow: 0 4px 16px rgba(249, 83, 198, 0.15);
}
</style> 