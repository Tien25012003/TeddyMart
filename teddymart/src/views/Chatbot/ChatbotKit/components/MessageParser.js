import React from 'react';

const MessageParser = ({ children, actions }) => {
  const parse = (value) => {
    const message= value.trim().toLowerCase()
    if (message.includes('hello')) {
      actions.handleHelpQ1();
    } else if (message.includes('what is Teddy Mart') || message.includes("teddymart")) {
      actions.handleHelpQ2();
    } else if (message.includes('main users') || message.includes('who uses Teddy Mart')) {
      actions.handleHelpQ3();
    } else if (message.includes('key features') || message.includes('features of Teddy Mart')) {
      actions.handleHelpQ4();
    } else if (message.includes('comprehensive features')|| message.includes("features")) {
      actions.handleHelpQ5();
    } else if (message.includes('reports and statistics')|| message.includes("statistics")) {
      actions.handleHelpQ6();
    } else if (message.includes('role of a cashier')|| message.includes("role")) {
      actions.handleHelpQ7();
    } else if (message.includes('sales management')|| message.includes("management")) {
      actions.handleHelpQ8();
    } else if (message.includes('change password')|| message.includes("password")) {
      actions.handleHelpQ9();
    } else if (message.includes('product management')) {
      actions.handleHelpQ10();
    } else if (message.includes('improve efficiency')) {
      actions.handleHelpQ11();
    } else if (message.includes('generate financial reports')) {
      actions.handleHelpQ12();
    } else if (message.includes('inventory management')) {
      actions.handleHelpQ13();
    } else if (message.includes('vouchers in the sales process')) {
      actions.handleHelpQ14();
    } else if (message.includes('track supplier debts')) {
      actions.handleHelpQ15();
    } else if (message.includes('types of reports')) {
      actions.handleHelpQ16();
    } else if (message.includes('managing suppliers and customers')) {
      actions.handleHelpQ17();
    } else if (message.includes('search product information')) {
      actions.handleHelpQ18();
    } else if (message.includes('sales performance analytics')) {
      actions.handleHelpQ19();
    } else if (message.includes('staff management')) {
      actions.handleHelpQ20();
    } else if (message.includes('role of operations manager')) {
      actions.handleHelpQ21();
    } else if (message.includes('update warehouse information')) {
      actions.handleHelpQ22();
    } else if (message.includes('visual dashboard for reporting')) {
      actions.handleHelpQ23();
    } else if (message.includes('checkout process')) {
      actions.handleHelpQ24();
    } else if (message.includes('reports about orders')) {
      actions.handleHelpQ25();
    } else {
      console.log('No matching action found for the input message.');
    }
  };


  return (
    <div>
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, {
          parse: parse,
          actions: {},
        });
      })}
    </div>
  );
};

export default MessageParser;