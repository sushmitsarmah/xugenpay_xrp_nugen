# XugenPay

### Project Description: Decentralized Payment Insights Platform

This project is building a Venmo-inspired peer-to-peer payment application designed for transparent and insightful financial transaction analysis. It integrates a diverse tech stack to provide robust user management, secure XRP payments, and powerful AI-driven querying capabilities over complex financial relationships.

### Key Features:

- User & Wallet Management (Supabase): Securely manages user accounts and associated XRP wallet addresses within Supabase, providing a scalable and accessible authentication and data layer.

- XRP Peer-to-Peer Payments (Xaman App Integration): Facilitates direct XRP token transfers between users, leveraging the Xaman app for secure and efficient transaction signing and broadcasting on the XRP Ledger.

- Graph-Powered Payment Tracking (Neo4j): Utilizes Neo4j as the core transactional database to model and track all payment events as interconnected relationships. This enables:

- Meticulous recording of "who paid whom."

- Discovery of complex multi-hop payment paths ("how many steps did money flow from A to C?").

- Visualization of financial networks and flows.

- AI-Driven Natural Language Querying (Nugen RAG): Empowers users to ask complex questions about payment histories and relationships in plain English. The system employs Nugen AI to:

- Dynamically translate natural language queries into executable Cypher (graph query language).

- Retrieve relevant structured data directly from the Neo4j graph.

- Generate coherent, human-readable answers based on the retrieved graph data.