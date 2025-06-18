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
  border: 1px solid #ccc;
  padding: 1rem;
  border-radius: 8px;
  background: #fafafa;
}
.messages {
  max-height: 300px;
  overflow-y: auto;
  margin-bottom: 1rem;
}
.message {
  margin-bottom: 0.5rem;
}
.timestamp {
  color: #888;
  font-size: 0.8em;
  margin-left: 0.5em;
}
form {
  display: flex;
  gap: 0.5rem;
}
input {
  flex: 1;
  padding: 0.3rem;
}
button {
  padding: 0.3rem 1rem;
}
</style> 