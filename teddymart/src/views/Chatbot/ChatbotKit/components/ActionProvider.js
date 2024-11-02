import React from 'react';

const ActionProvider = ({ createChatBotMessage, setState, children }) => {
  const handleHelpQ1 = () => {
    const botMessage = createChatBotMessage(`
      Teddy Mart is a Supermarket Products Management Website developed to help managers oversee and manage products, sales, warehouse, suppliers, customers, and view reports and statistics. It streamlines supermarket operations, enhances inventory control, and improves overall efficiency.
    `);
    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }));
  };
  
  const handleHelpQ2 = () => {
    const botMessage = createChatBotMessage(`
      The main users of Teddy Mart include supermarket managers, operations managers, cashiers, shop associates, accountants, and warehouse keepers. Each user has specific responsibilities, such as managing products, overseeing daily operations, handling transactions, and maintaining inventory.
    `);
    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }));
  };
  
  const handleHelpQ3 = () => {
    const botMessage = createChatBotMessage(`
      Key features of Teddy Mart include:
      - Authentication for managers to sign up, sign in, and change passwords.
      - Partner management for adding, updating, and tracking customer and supplier information.
      - Product management to organize products into categories and store them on shelves.
      - Sale management for handling orders, vouchers, and calculating discounts.
      - Warehouse management to track product quantities and inventory levels.
      - Reporting and statistics for financial performance, product details, and sales reports.
    `);
    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }));
  };
  
  const handleHelpQ4 = () => {
    const botMessage = createChatBotMessage(`
      Teddy Mart helps with warehouse management by allowing managers to add, update, delete, and search warehouse information. The system stores product details, stock levels, and quantities on shelves and in the warehouse, ensuring efficient inventory tracking.
    `);
    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }));
  };
  
  // Repeat similar function blocks for questions 5 to 25:
  
  const handleHelpQ5 = () => {
    const botMessage = createChatBotMessage(`
      Yes, Teddy Mart allows managers to add, update, delete, and search for customer and supplier information. The system also tracks customer debts after orders are created, aiding in partner relationship management.
    `);
    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }));
  };
  
  const handleHelpQ6 = () => {
    const botMessage = createChatBotMessage(`
      Teddy Mart generates financial reports that show supermarket income and expenses for specific periods. It also provides detailed product and order reports with visual statistics to assist managers in decision-making.
    `);
    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }));
  };
  
  const handleHelpQ7 = () => {
    const botMessage = createChatBotMessage(`
      In Teddy Mart, cashiers handle customer transactions at the point of sale. They accept payments, issue receipts, and provide customer service during the checkout process.
    `);
    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }));
  };
  
  const handleHelpQ8 = () => {
    const botMessage = createChatBotMessage(`
      Teddy Mart helps with sales management by allowing managers to handle orders and vouchers, as well as updating, deleting, and searching through sales records. The system applies voucher discounts automatically during checkout, ensuring accurate billing.
    `);
    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }));
  };
  
  const handleHelpQ9 = () => {
    const botMessage = createChatBotMessage(`
      Yes, Teddy Mart includes authentication features that allow managers to sign up, sign in, and change their passwords as needed.
    `);
    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }));
  };
  
  const handleHelpQ10 = () => {
    const botMessage = createChatBotMessage(`
      Teddy Mart enables product management by allowing managers to add, update, delete, and search for product information. Managers can categorize products and arrange them on shelves for better inventory tracking.
    `);
    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }));
  };const handleHelpQ11 = () => {
    const botMessage = createChatBotMessage(`
      Teddy Mart improves efficiency by automating various tasks such as product management, sales tracking, warehouse operations, and report generation. This saves time and effort for supermarket managers and employees, while also increasing the accuracy of the information.
    `);
    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }));
  };
  
  const handleHelpQ12 = () => {
    const botMessage = createChatBotMessage(`
      Yes, Teddy Mart provides detailed financial reports that include the supermarket’s income and expenses. These reports can be generated for specific periods or on demand, helping managers track financial performance.
    `);
    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }));
  };
  
  const handleHelpQ13 = () => {
    const botMessage = createChatBotMessage(`
      Teddy Mart helps with inventory management by tracking the quantity of products both on shelves and in the warehouse. It provides real-time data on stock levels, ensuring that products are available when needed and helping prevent overstock or shortages.
    `);
    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }));
  };
  
  const handleHelpQ14 = () => {
    const botMessage = createChatBotMessage(`
      Teddy Mart handles vouchers in the sales process by allowing managers to add, update, or delete vouchers. The system automatically applies the voucher during checkout, calculating discounts for orders and ensuring accurate billing.
    `);
    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }));
  };
  
  const handleHelpQ15 = () => {
    const botMessage = createChatBotMessage(`
      Yes, Teddy Mart records and tracks partner debts after an order is created, allowing managers to monitor outstanding payments from suppliers and customers.
    `);
    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }));
  };
  
  const handleHelpQ16 = () => {
    const botMessage = createChatBotMessage(`
      Teddy Mart can generate various types of reports, including financial reports that track income and expenses, as well as reports on products and orders. It also offers visual statistics for easy interpretation of the data.
    `);
    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }));
  };
  
  const handleHelpQ17 = () => {
    const botMessage = createChatBotMessage(`
      Teddy Mart assists in managing suppliers and customers by allowing managers to add, update, search, and delete records. The system helps maintain a detailed history of interactions with partners.
    `);
    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }));
  };
  
  const handleHelpQ18 = () => {
    const botMessage = createChatBotMessage(`
      Yes, Teddy Mart provides a powerful search function that allows managers to quickly find specific product information, whether it’s grouped by category or listed individually.
    `);
    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }));
  };
  
  const handleHelpQ19 = () => {
    const botMessage = createChatBotMessage(`
      Yes, Teddy Mart includes advanced analytics features that provide insights into sales performance. Managers can view trends over time, track the performance of different product categories, and use this data to make strategic decisions.
    `);
    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }));
  };
  
  const handleHelpQ20 = () => {
    const botMessage = createChatBotMessage(`
      Teddy Mart enables managers to manage staff information, track employee roles such as cashiers, shop associates, and accountants, and monitor their performance in relation to their specific tasks within the supermarket.
    `);
    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }));
  };
  const handleHelpQ21 = () => {
    const botMessage = createChatBotMessage(`
      In Teddy Mart, the operations manager oversees day-to-day business operations. This includes logistics, supply chain management, and ensuring that the supermarket’s processes are running smoothly and efficiently.
    `);
    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }));
  };
  
  const handleHelpQ22 = () => {
    const botMessage = createChatBotMessage(`
      Yes, Teddy Mart allows you to update warehouse information, including stock levels and the quantity of products in the warehouse and on shelves. This ensures that warehouse data is always accurate and up to date.
    `);
    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }));
  };
  
  const handleHelpQ23 = () => {
    const botMessage = createChatBotMessage(`
      Yes, Teddy Mart provides a visual dashboard that displays key performance metrics, such as sales trends, inventory levels, and financial reports. The visual format helps managers quickly understand the supermarket's status.
    `);
    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }));
  };
  
  const handleHelpQ24 = () => {
    const botMessage = createChatBotMessage(`
      Teddy Mart facilitates the checkout process by providing an interface for cashiers to process customer transactions. It also applies any vouchers automatically and generates receipts for customers.
    `);
    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }));
  };
  
  const handleHelpQ25 = () => {
    const botMessage = createChatBotMessage(`
      Teddy Mart generates detailed reports on customer orders, including the number of orders, total sales, and product performance. These reports help managers track sales trends and make informed decisions.
    `);
    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }));
  };
  
  return (
    <div>
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, {
          actions:{
            handleHelpQ1,
            handleHelpQ2,
            handleHelpQ3,
            handleHelpQ4,
            handleHelpQ5,
            handleHelpQ6,  // for question 6: What reports and statistics does Teddy Mart provide?
            handleHelpQ7,  // for question 7: What is the role of a cashier in Teddy Mart?
            handleHelpQ8,  // for question 8: How does Teddy Mart help with sales management?
            handleHelpQ9,  // for question 9: Can managers change their passwords in Teddy Mart?
            handleHelpQ10, // for question 10: How does Teddy Mart handle product management?
            handleHelpQ11, // for question 11: How does Teddy Mart improve supermarket management efficiency?
            handleHelpQ12, // for question 12: Can I generate financial reports using Teddy Mart?
            handleHelpQ13, // for question 13: How does Teddy Mart help with inventory management?
            handleHelpQ14, // for question 14: How does Teddy Mart handle vouchers in the sales process?
            handleHelpQ15, // for question 15: Can Teddy Mart be used to track supplier debts?
            handleHelpQ16, // for question 16: What types of reports can Teddy Mart generate?
            handleHelpQ17, // for question 17: How does Teddy Mart assist in managing suppliers and customers?
            handleHelpQ18, // for question 18: Can I search for specific product information using Teddy Mart?
            handleHelpQ19, // for question 19: Does Teddy Mart offer analytics for sales performance?
            handleHelpQ20, // for question 20: How does Teddy Mart handle staff management?
            handleHelpQ21, // for question 21: What is the role of an operations manager in Teddy Mart?
            handleHelpQ22, // for question 22: Can I update warehouse information through Teddy Mart?
            handleHelpQ23, // for question 23: Does Teddy Mart offer a visual dashboard for reporting?
            handleHelpQ24, // for question 24: How does Teddy Mart help with the checkout process?
            handleHelpQ25  // for
          }
        });
      })}
    </div>
  );
};

export default ActionProvider;