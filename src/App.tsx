import { useEffect, useState } from "react";
import { useAuthenticator } from "@aws-amplify/ui-react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>();

function App() {
  const { user, signOut } = useAuthenticator((context) => [context.user]);
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  const [challenges, setChallenges] = useState<Array<Schema["Challenge"]["type"]>>([]);

  useEffect(() => {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
    
    client.models.Challenge.observeQuery().subscribe({
      next: (data) => setChallenges([...data.items]),
    });
  }, []);

  function createTodo() {
    const content = window.prompt("Task description");
    if (content) {
      client.models.Todo.create({ 
        content,
        priority: "MEDIUM",
        category: "General",
        completed: false
      });
    }
  }

  function createChallenge() {
    const title = window.prompt("Challenge title");
    const description = window.prompt("Challenge description");
    if (title) {
      client.models.Challenge.create({
        title,
        description: description || "",
        points: 100,
        difficulty: "INTERMEDIATE",
        category: "AWS",
        isCompleted: false
      });
    }
  }

  function toggleTodo(id: string, completed: boolean) {
    client.models.Todo.update({ id, completed: !completed });
  }

  function toggleChallenge(id: string, isCompleted: boolean) {
    client.models.Challenge.update({ id, isCompleted: !isCompleted });
  }

  return (
    <main style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
          <span style={{ color: '#666', marginRight: '1rem', alignSelf: 'center' }}>
            {user?.signInDetails?.loginId}
          </span>
          <button
            onClick={signOut}
            style={{
              background: 'transparent',
              color: '#FF1493',
              border: '2px solid #FF69B4',
              padding: '8px 16px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '0.9rem'
            }}
          >
            Sign Out
          </button>
        </div>
        <h1 style={{
          color: '#FF69B4',
          fontSize: '3rem',
          margin: '0',
          textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
        }}>
          🌸 Pink Team Competition 🌸
        </h1>
        <h2 style={{
          color: '#666',
          fontSize: '1.4rem',
          margin: '0.5rem 0',
          fontWeight: 'normal'
        }}>
          AWS re:Invent 2025 Road-to-reInvent
        </h2>
      </header>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <section>
          <h3 style={{ color: '#FF1493', borderBottom: '2px solid #FF69B4', paddingBottom: '10px' }}>
            Team Tasks
          </h3>
          <button onClick={createTodo} style={{ 
            background: 'linear-gradient(45deg, #FF69B4, #FF1493)',
            color: 'white', 
            border: 'none', 
            padding: '12px 24px', 
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold',
            marginBottom: '20px'
          }}>
            + Add Task
          </button>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {todos.map((todo) => (
              <li key={todo.id} style={{ 
                background: todo.completed ? 'rgba(144, 238, 144, 0.3)' : 'rgba(255, 182, 193, 0.3)',
                margin: '10px 0', 
                padding: '15px', 
                borderRadius: '8px',
                borderLeft: `4px solid ${todo.completed ? '#90EE90' : '#FF69B4'}`,
                cursor: 'pointer',
                textDecoration: todo.completed ? 'line-through' : 'none'
              }}
              onClick={() => toggleTodo(todo.id, todo.completed || false)}
              >
                <strong>{todo.content}</strong>
                <br />
                <small style={{ color: '#666' }}>
                  Priority: {todo.priority} | Category: {todo.category}
                </small>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h3 style={{ color: '#FF1493', borderBottom: '2px solid #FF69B4', paddingBottom: '10px' }}>
            Competition Challenges
          </h3>
          <button onClick={createChallenge} style={{ 
            background: 'linear-gradient(45deg, #FF1493, #DC143C)',
            color: 'white', 
            border: 'none', 
            padding: '12px 24px', 
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold',
            marginBottom: '20px'
          }}>
            + Add Challenge
          </button>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {challenges.map((challenge) => (
              <li key={challenge.id} style={{ 
                background: challenge.isCompleted ? 'rgba(255, 215, 0, 0.3)' : 'rgba(255, 105, 180, 0.2)',
                margin: '10px 0', 
                padding: '15px', 
                borderRadius: '8px',
                borderLeft: `4px solid ${challenge.isCompleted ? '#FFD700' : '#FF69B4'}`,
                cursor: 'pointer'
              }}
              onClick={() => toggleChallenge(challenge.id, challenge.isCompleted || false)}
              >
                <strong>{challenge.title}</strong> 
                <span style={{ 
                  background: challenge.isCompleted ? '#FFD700' : '#FF69B4',
                  color: 'white',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  marginLeft: '10px'
                }}>
                  {challenge.points} pts
                </span>
                <br />
                <small style={{ color: '#666' }}>
                  {challenge.description}
                </small>
                <br />
                <small style={{ color: '#888' }}>
                  Difficulty: {challenge.difficulty} | Category: {challenge.category}
                </small>
              </li>
            ))}
          </ul>
        </section>
      </div>
      
      <footer style={{
        marginTop: '4rem',
        textAlign: 'center',
        color: '#666',
        borderTop: '1px solid #FFB6C1',
        paddingTop: '2rem'
      }}>
        <div style={{ marginBottom: '1rem' }}>
          <a
            href="/setup"
            style={{
              color: '#FF1493',
              textDecoration: 'none',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              padding: '10px 20px',
              border: '2px solid #FF69B4',
              borderRadius: '8px',
              display: 'inline-block',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'linear-gradient(45deg, #FF69B4, #FF1493)';
              e.currentTarget.style.color = 'white';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#FF1493';
            }}
          >
            📋 Setup Guide
          </a>
        </div>
        <div>
          🚀 Pink Team Platform - Powered by AWS Amplify
          <br />
          <small>Showcasing React, GraphQL, DynamoDB, and real-time updates</small>
        </div>
      </footer>
    </main>
  );
}

export default App;
