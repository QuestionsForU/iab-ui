
import React, { useState } from 'react';


const IUIInvoiceItems = () => {
    const module = "invoiceItem"
    
    // State to hold the list of invoiceItems
    const [invoiceItems, setInvoiceItems] = useState([]);
    // State to hold the current input values
    const [item, setItem] = useState('');
    const [qty, setQty] = useState('');
    const [weight, setWeight] = useState('');
    const [rate, setRate] = useState('');
    const [hsnCode, setHsnCode] = useState('');
    const [sgst, setSgst] = useState('');
    const [cgst, setCgst] = useState('');
    const [mkngChrg, setMkngChrg] = useState('');
    const [addChrg, setAddChrg] = useState('');
    const [hmChrg, setHmChrg] = useState('');

    // State to keep track of the item being edited
    const [editIndex, setEditIndex] = useState(null);

    // Function to handle name input changes
    const handleItemChange = (e) => {
        setItem(e.target.value);
    }
    const handleQtyChange = (e) => {
        setQty(e.target.value);
    }
    const handleWeightChange = (e) => {
        setWeight(e.target.value);
    }
    const handleRateChange = (e) => {
        setRate(e.target.value);
    }
    const handleHsnCodeChange = (e) => {
        setHsnCode(e.target.value);
    }
    const handleSgstChange = (e) => {
        setSgst(e.target.value);
    }
    const handleCgstChange = (e) => {
        setCgst(e.target.value);
    }
    const handleMkngChrgChange = (e) => {
        setMkngChrg(e.target.value);
    }
    const handleAddChrgChange = (e) => {
        setAddChrg(e.target.value);
    }
    const handleHmChrgChange = (e) => {
        setHmChrg(e.target.value);
    }

    // Function to add a new invoice item
    const addInvoiceItem = () => {
        console.log(module)
        if (item.trim() !== '' && qty.trim() !== '') {
            const newItem = { item, qty, weight, rate, hsnCode, sgst, cgst, mkngChrg, addChrg, hmChrg };
            if (editIndex !== null) {
                // Update existing item
                const updatedItems = invoiceItems.map((invItem, index) =>
                    index === editIndex ? newItem : invItem
                );
                setInvoiceItems(updatedItems);
                setEditIndex(null); // Clear edit mode
            } else {
                // Add new item
                setInvoiceItems([...invoiceItems, newItem]);
            }
            // Clear input fields
            setItem('');
            setQty('');
            setWeight('');
            setRate('');
            setHsnCode('');
            setSgst('');
            setCgst('');
            setMkngChrg('');
            setAddChrg('');
            setHmChrg('');
        }
    };

    // Function to handle Enter key press
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            addInvoiceItem();
        }
    };

    const deleteInvoiceItem = (index) => {
        const newInvoiceItems = invoiceItems.filter((_, i) => i !== index);
        setInvoiceItems(newInvoiceItems);
    };

    const editInvoiceItem = (index) => {
        const itemToEdit = invoiceItems[index];
        setItem(itemToEdit.item);
        setQty(itemToEdit.qty);
        setWeight(itemToEdit.weight);
        setRate(itemToEdit.rate);
        setHsnCode(itemToEdit.hsnCode);
        setSgst(itemToEdit.sgst);
        setCgst(itemToEdit.cgst);
        setMkngChrg(itemToEdit.mkngChrg);
        setAddChrg(itemToEdit.addChrg);
        setHmChrg(itemToEdit.hmChrg);
        setEditIndex(index); // Set the index of the item being edited
    };

    return (
        <div className="App">
            <h1>Invoice Items</h1>
            <div className="input-container">
                <div className="input-group">
                    <label htmlFor="item">Item:</label>
                    <input
                        id="item"
                        type="text"
                        value={item}
                        onChange={handleItemChange}
                        onKeyPress={handleKeyPress}
                        placeholder="Enter Item"
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="qty">Quantity:</label>
                    <input
                        id="qty"
                        type="text"
                        value={qty}
                        onChange={handleQtyChange}
                        onKeyPress={handleKeyPress}
                        placeholder="Enter Quantity.."
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="weight">Weight:</label>
                    <input
                        id="weight"
                        type="text"
                        value={weight}
                        onChange={handleWeightChange}
                        onKeyPress={handleKeyPress}
                        placeholder="Enter Weight.."
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="rate">Rate[per Item]/ Date:</label>
                    <input
                        id="rate"
                        type="text"
                        value={rate}
                        onChange={handleRateChange}
                        onKeyPress={handleKeyPress}
                        placeholder="Enter Rate.."
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="hsnCode">HSN Code:</label>
                    <input
                        id="hsnCode"
                        type="text"
                        value={hsnCode}
                        onChange={handleHsnCodeChange}
                        onKeyPress={handleKeyPress}
                        placeholder="Enter HSN Code.."
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="sgst">SGST:</label>
                    <input
                        id="sgst"
                        type="text"
                        value={sgst}
                        onChange={handleSgstChange}
                        onKeyPress={handleKeyPress}
                        placeholder="Enter SGST.."
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="cgst">CGST:</label>
                    <input
                        id="cgst"
                        type="text"
                        value={cgst}
                        onChange={handleCgstChange}
                        onKeyPress={handleKeyPress}
                        placeholder="Enter CGST.."
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="mkngChrg">Making Charge:</label>
                    <input
                        id="mkngChrg"
                        type="text"
                        value={mkngChrg}
                        onChange={handleMkngChrgChange}
                        onKeyPress={handleKeyPress}
                        placeholder="Enter Making Charge.."
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="addChrg">Additional Charge:</label>
                    <input
                        id="addChrg"
                        type="text"
                        value={addChrg}
                        onChange={handleAddChrgChange}
                        onKeyPress={handleKeyPress}
                        placeholder="Enter Additional Charge.."
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="hmChrg">H. Mark Charge:</label>
                    <input
                        id="hmChrg"
                        type="text"
                        value={hmChrg}
                        onChange={handleHmChrgChange}
                        onKeyPress={handleKeyPress}
                        placeholder="Enter H. Mark Charge.."
                    />
                </div>
                <button onClick={addInvoiceItem}>{editIndex !== null ? 'Save Changes' : 'Add'}</button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Quantity</th>
                        <th>Weight</th>
                        <th>Rate[per Item]/Date</th>
                        <th>HSN Code</th>
                        <th>SGST</th>
                        <th>CGST</th>
                        <th>Making Charge</th>
                        <th>Additional Charge</th>
                        <th>H. Mark Charge</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {invoiceItems.map((invoiceItem, index) => (
                        <tr key={index}>
                            <td>{invoiceItem.item}</td>
                            <td>{invoiceItem.qty}</td>
                            <td>{invoiceItem.weight}</td>
                            <td>{invoiceItem.rate}</td>
                            <td>{invoiceItem.hsnCode}</td>
                            <td>{invoiceItem.sgst}</td>
                            <td>{invoiceItem.cgst}</td>
                            <td>{invoiceItem.mkngChrg}</td>
                            <td>{invoiceItem.addChrg}</td>
                            <td>{invoiceItem.hmChrg}</td>
                            <td>
                                <button onClick={() => editInvoiceItem(index)}>Edit</button>
                                <button onClick={() => deleteInvoiceItem(index)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default IUIInvoiceItems;





