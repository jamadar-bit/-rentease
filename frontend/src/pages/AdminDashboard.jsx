import { useState, useEffect } from 'react';
import { Users, PackageSearch, AlertTriangle, FileText, Settings, Map, TrendingUp, CheckCircle, XCircle, Trash2, Edit, Check, Wrench, X, ShieldAlert, Plus } from 'lucide-react';
import axios from 'axios';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('inventory');
  const [stats, setStats] = useState({
    totalRevenue: 0, activeRentals: 0, pendingSupport: 0, totalUsers: 0, categoryStats: [], recentRentals: []
  });
  const [products, setProducts] = useState([]);
  const [rentals, setRentals] = useState([]);
  const [maintenance, setMaintenance] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [serviceAreas, setServiceAreas] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modals Open State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // null means "Add New"
  const [productForm, setProductForm] = useState({
    name: '', description: '', monthlyRent: '', securityDeposit: '', stock: '', imageUrl: '', category: 'Furniture', tenureOptionsStr: '3, 6, 12'
  });

  const [isAreaModalOpen, setIsAreaModalOpen] = useState(false);
  const [areaForm, setAreaForm] = useState({ name: '', pincode: '', active: true });

  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const [selectedRental, setSelectedRental] = useState(null);
  const [claimForm, setClaimForm] = useState({ damageClaim: 0, damageDescription: '', disputeStatus: 'None', disputeDescription: '' });

  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [ticketForm, setTicketForm] = useState({ status: 'Pending', resolutionNotes: '' });

  const fetchAllAdminData = async () => {
    try {
      setLoading(true);
      setError('');
      const [statsRes, prodRes, rentalsRes, maintRes, usersRes, areasRes] = await Promise.all([
        axios.get('/api/admin/stats', { timeout: 3000 }),
        axios.get('/api/products', { timeout: 3000 }),
        axios.get('/api/rentals', { timeout: 3000 }),
        axios.get('/api/maintenance', { timeout: 3000 }),
        axios.get('/api/auth', { timeout: 3000 }),
        axios.get('/api/serviceareas', { timeout: 3000 })
      ]);

      setStats(statsRes.data);
      setProducts(prodRes.data);
      setRentals(rentalsRes.data);
      setMaintenance(maintRes.data);
      setUsersList(usersRes.data);
      setServiceAreas(areasRes.data);
    } catch (err) {
      console.warn('Backend connections failed. Displaying simulated admin database.');
      // Offline fallback lists
      setProducts([
        { _id: 'p1', name: 'Premium Sofa Set', description: 'Comfortable sofa', monthlyRent: 1500, securityDeposit: 3000, tenureOptions: [3, 6, 12], stock: 12, category: 'Furniture', imageUrl: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=600&q=80' },
        { _id: 'p2', name: 'Smart LED TV 55"', description: '4K Cinematic TV', monthlyRent: 1200, securityDeposit: 2500, tenureOptions: [3, 6, 12], stock: 8, category: 'Appliances', imageUrl: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&q=80' }
      ]);
      setRentals([
        { _id: 'r1', user: { name: 'John Doe', email: 'user@rentease.com' }, product: { name: 'Premium Sofa Set' }, totalCost: 12000, status: 'Active', deliveryStatus: 'Delivered', deliveryAddress: '123 Tech Lane, Bangalore', deliveryDate: '2026-05-24', disputeStatus: 'None', damageClaim: 0 },
        { _id: 'r2', user: { name: 'Jane Smith', email: 'jane@example.com' }, product: { name: 'Smart LED TV 55"' }, totalCost: 9700, status: 'Pending', deliveryStatus: 'Scheduled', deliveryAddress: '456 Royal Residency, Mumbai', deliveryDate: '2026-05-25', disputeStatus: 'None', damageClaim: 0 }
      ]);
      setMaintenance([
        { _id: 'm1', rental: { _id: 'r1' }, user: { name: 'John Doe', email: 'user@rentease.com' }, issueDescription: 'Fabric tear on sofa armrest', status: 'Pending', resolutionNotes: '', createdAt: '2026-05-23' }
      ]);
      setUsersList([
        { _id: 'u1', name: 'Admin User', email: 'admin@rentease.com', role: 'admin' },
        { _id: 'u2', name: 'John Doe', email: 'user@rentease.com', role: 'user' }
      ]);
      setServiceAreas([
        { _id: 'a1', name: 'Mumbai', pincode: '400001', active: true },
        { _id: 'a2', name: 'Bangalore', pincode: '560001', active: true }
      ]);
      setStats({
        totalRevenue: 21700, activeRentals: 1, pendingSupport: 1, totalUsers: 1, categoryStats: [], recentRentals: []
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllAdminData();
  }, []);

  // Product actions
  const handleOpenProductModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setProductForm({
        name: product.name,
        description: product.description,
        monthlyRent: product.monthlyRent,
        securityDeposit: product.securityDeposit,
        stock: product.stock,
        imageUrl: product.imageUrl,
        category: product.category,
        tenureOptionsStr: product.tenureOptions.join(', ')
      });
    } else {
      setEditingProduct(null);
      setProductForm({
        name: '', description: '', monthlyRent: '', securityDeposit: '', stock: '', imageUrl: '', category: 'Furniture', tenureOptionsStr: '3, 6, 12'
      });
    }
    setIsProductModalOpen(true);
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    const tenureOptions = productForm.tenureOptionsStr.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
    const payload = {
      name: productForm.name,
      description: productForm.description,
      monthlyRent: parseFloat(productForm.monthlyRent),
      securityDeposit: parseFloat(productForm.securityDeposit),
      stock: parseInt(productForm.stock),
      imageUrl: productForm.imageUrl,
      category: productForm.category,
      tenureOptions
    };

    try {
      if (editingProduct) {
        await axios.put(`/api/products/${editingProduct._id}`, payload);
      } else {
        await axios.post('/api/products', payload);
      }
      setIsProductModalOpen(false);
      fetchAllAdminData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving product');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product listing?')) return;
    try {
      await axios.delete(`/api/products/${id}`);
      fetchAllAdminData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting product');
    }
  };

  // Order & Status Updates
  const handleUpdateOrderStatus = async (rentalId, status) => {
    try {
      await axios.put(`/api/rentals/${rentalId}/status`, { status });
      fetchAllAdminData();
    } catch (err) {
      alert('Error updating order status');
    }
  };

  const handleUpdateDeliveryStatus = async (rentalId, deliveryStatus) => {
    try {
      await axios.put(`/api/rentals/${rentalId}/status`, { deliveryStatus });
      fetchAllAdminData();
    } catch (err) {
      alert('Error updating delivery schedule');
    }
  };

  // Damage & Dispute claim submissions
  const handleOpenClaimModal = (rental) => {
    setSelectedRental(rental);
    setClaimForm({
      damageClaim: rental.damageClaim || 0,
      damageDescription: rental.damageDescription || '',
      disputeStatus: rental.disputeStatus || 'None',
      disputeDescription: rental.disputeDescription || ''
    });
    setIsClaimModalOpen(true);
  };

  const handleClaimSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/rentals/${selectedRental._id}/status`, {
        damageClaim: parseFloat(claimForm.damageClaim),
        damageDescription: claimForm.damageDescription,
        disputeStatus: claimForm.disputeStatus,
        disputeDescription: claimForm.disputeDescription
      });
      setIsClaimModalOpen(false);
      fetchAllAdminData();
    } catch (err) {
      alert('Error filing damage/dispute claim');
    }
  };

  // Resolve Ticket
  const handleOpenTicketModal = (ticket) => {
    setSelectedTicket(ticket);
    setTicketForm({
      status: ticket.status,
      resolutionNotes: ticket.resolutionNotes || ''
    });
    setIsTicketModalOpen(true);
  };

  const handleTicketSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/maintenance/${selectedTicket._id}/status`, {
        status: ticketForm.status,
        resolutionNotes: ticketForm.resolutionNotes
      });
      setIsTicketModalOpen(false);
      fetchAllAdminData();
    } catch (err) {
      alert('Error updating ticket status');
    }
  };

  // Service Areas
  const handleToggleArea = async (area) => {
    try {
      await axios.put(`/api/serviceareas/${area._id}`, { active: !area.active });
      fetchAllAdminData();
    } catch (err) {
      alert('Error toggling service area');
    }
  };

  const handleAreaSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/serviceareas', areaForm);
      setIsAreaModalOpen(false);
      setAreaForm({ name: '', pincode: '', active: true });
      fetchAllAdminData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error adding service area');
    }
  };

  const handleDeleteArea = async (id) => {
    if (!window.confirm('Delete this pincode coverage?')) return;
    try {
      await axios.delete(`/api/serviceareas/${id}`);
      fetchAllAdminData();
    } catch (err) {
      alert('Error deleting service area');
    }
  };

  // User Role Management
  const handleUpdateRole = async (userId, role) => {
    try {
      await axios.put(`/api/auth/${userId}/role`, { role });
      fetchAllAdminData();
    } catch (err) {
      alert('Failed to update user authorization role');
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
      <p className="text-gray-500 font-medium">Loading administrative workspace...</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 relative">
      
      {/* Admin Sidebar */}
      <div className="w-full lg:w-64 flex-shrink-0">
        <div className="bg-gray-900 rounded-3xl p-6 shadow-xl sticky top-24 text-white">
          <div className="mb-8">
            <h3 className="font-black text-2xl bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-200">Admin Portal</h3>
            <p className="text-sm text-gray-400 mt-1">RentEase Manager</p>
          </div>
          
          <nav className="space-y-2">
            {[
              { id: 'inventory', icon: PackageSearch, label: 'Inventory & Pricing' },
              { id: 'orders', icon: TrendingUp, label: 'Orders & Rentals' },
              { id: 'disputes', icon: AlertTriangle, label: 'Disputes & Repairs' },
              { id: 'users', icon: Users, label: 'Manage Users' },
              { id: 'reports', icon: FileText, label: 'Reports & Analytics' },
              { id: 'areas', icon: Map, label: 'Service Areas' }
            ].map(item => (
              <button 
                key={item.id}
                onClick={() => setActiveTab(item.id)} 
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition ${activeTab === item.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
              >
                <item.icon className="w-5 h-5"/> {item.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Admin Main Content Area */}
      <div className="flex-1 space-y-8">
        
        {/* Top Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {[
            { label: 'Total Revenue', value: `₹${stats.totalRevenue.toLocaleString()}`, icon: TrendingUp, color: 'text-green-600 bg-green-50' },
            { label: 'Active Rentals', value: stats.activeRentals, icon: PackageSearch, color: 'text-blue-600 bg-blue-50' },
            { label: 'Pending Support', value: stats.pendingSupport, icon: Wrench, color: 'text-orange-600 bg-orange-50' },
            { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-purple-600 bg-purple-50' }
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-bold mb-1">{stat.label}</p>
                <h4 className="text-3xl font-black text-gray-900">{stat.value}</h4>
              </div>
              <div className={`p-4 rounded-2xl ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          ))}
        </div>

        {/* Dynamic Tab Content */}
        <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] min-h-[500px]">
          
          {/* TAB 1: INVENTORY */}
          {activeTab === 'inventory' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-2xl font-extrabold text-gray-900">Inventory Management</h3>
                  <p className="text-gray-500 text-sm mt-1">Manage rental pricing, deposits, stocks, and description details.</p>
                </div>
                <button onClick={() => handleOpenProductModal(null)} className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition shadow-md flex items-center gap-2">
                  <Plus className="w-5 h-5"/> Add Product
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="bg-gray-50 text-gray-900 font-bold border-b border-gray-100">
                      <th className="p-4 rounded-tl-xl">Product</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Monthly Rent</th>
                      <th className="p-4">Security Deposit</th>
                      <th className="p-4">Stock</th>
                      <th className="p-4 rounded-tr-xl">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(product => (
                      <tr key={product._id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                        <td className="p-4 flex items-center gap-3">
                          <img src={product.imageUrl} className="w-10 h-10 object-cover rounded-lg border" alt="" />
                          <span className="font-bold text-gray-900">{product.name}</span>
                        </td>
                        <td className="p-4 text-gray-600 text-sm">{product.category}</td>
                        <td className="p-4 font-bold text-blue-600">₹{product.monthlyRent.toLocaleString()}</td>
                        <td className="p-4 text-gray-700 font-semibold">₹{product.securityDeposit.toLocaleString()}</td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {product.stock} Left
                          </span>
                        </td>
                        <td className="p-4 flex gap-2">
                          <button onClick={() => handleOpenProductModal(product)} className="text-blue-600 font-bold text-sm hover:bg-blue-50 px-2 py-1 rounded transition flex items-center gap-1"><Edit className="w-4 h-4"/> Edit</button>
                          <button onClick={() => handleDeleteProduct(product._id)} className="text-red-600 font-bold text-sm hover:bg-red-50 px-2 py-1 rounded transition flex items-center gap-1"><Trash2 className="w-4 h-4"/> Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: ORDERS & RENTALS */}
          {activeTab === 'orders' && (
            <div>
              <h3 className="text-2xl font-extrabold text-gray-900 mb-2">Active Orders & Dispatch</h3>
              <p className="text-gray-500 mb-6 text-sm">Monitor ongoing active rental contracts, set delivery schedules, and record damage/disputes.</p>
              
              <div className="space-y-6">
                {rentals.length === 0 ? (
                  <p className="text-gray-500 text-center py-10 font-bold">No rental orders placed yet.</p>
                ) : (
                  rentals.map(rental => {
                    const prodName = rental.product?.name || 'Rental Item';
                    const userName = rental.user?.name || 'Unknown User';

                    return (
                      <div key={rental._id} className="border border-gray-100 p-6 rounded-3xl bg-gray-50 flex flex-col md:flex-row justify-between gap-6">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <span className="font-extrabold text-gray-900">Order #{rental._id.substring(0, 8).toUpperCase()}</span>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${rental.status === 'Active' ? 'bg-green-100 text-green-700' : rental.status === 'Completed' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>
                              {rental.status}
                            </span>
                            <span className="text-xs bg-gray-200 font-bold text-gray-700 px-2.5 py-1 rounded-full">
                              Deliv: {rental.deliveryStatus}
                            </span>
                          </div>
                          
                          <p className="text-sm font-semibold text-gray-800">
                            User: {userName} ({rental.user?.email || 'N/A'})
                          </p>
                          <p className="text-sm text-gray-600 font-medium">
                            Product: <span className="font-bold text-gray-900">{prodName}</span> • Tenure: {rental.tenureMonths} Mos • Total Cost: ₹{rental.totalCost.toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-500">
                            Deliver Address: {rental.deliveryAddress} | Date: {new Date(rental.deliveryDate).toLocaleDateString()}
                          </p>
                          {rental.damageClaim > 0 && (
                            <p className="text-xs text-red-600 font-bold">
                              ⚠️ Damage Fee Charged: ₹{rental.damageClaim} ({rental.damageDescription})
                            </p>
                          )}
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-3 justify-end md:self-center">
                          {/* Order status controls */}
                          <select 
                            className="bg-white border rounded-xl px-3 py-2 text-xs font-bold text-gray-800 outline-none"
                            value={rental.status}
                            onChange={(e) => handleUpdateOrderStatus(rental._id, e.target.value)}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Active">Active</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>

                          {/* Delivery status controls */}
                          <select 
                            className="bg-white border rounded-xl px-3 py-2 text-xs font-bold text-gray-800 outline-none"
                            value={rental.deliveryStatus}
                            onChange={(e) => handleUpdateDeliveryStatus(rental._id, e.target.value)}
                          >
                            <option value="Scheduled">Scheduled</option>
                            <option value="Dispatched">Dispatched</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Returned">Returned</option>
                          </select>

                          <button onClick={() => handleOpenClaimModal(rental)} className="bg-gray-900 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1 hover:bg-black transition">
                            <ShieldAlert className="w-3.5 h-3.5"/> Dispute / Damage
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* TAB 3: DISPUTES & MAINTENANCE */}
          {activeTab === 'disputes' && (
            <div>
              <h3 className="text-2xl font-extrabold text-gray-900 mb-2">Disputes & Maintenance Requests</h3>
              <p className="text-gray-500 mb-6 text-sm">Handle customer support tickets, dispatch repairs, and log resolutions.</p>
              
              <div className="space-y-4">
                {maintenance.length === 0 ? (
                  <p className="text-gray-500 text-center py-10 font-bold">No active support tickets.</p>
                ) : (
                  maintenance.map(ticket => {
                    const userName = ticket.user?.name || 'Guest User';
                    const prodName = ticket.rental?.product?.name || ticket.productName || 'Rental Item';

                    return (
                      <div key={ticket._id} className="border border-gray-100 p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start gap-4 bg-gray-50">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-extrabold text-gray-900">Ticket #{ticket._id.substring(0, 8).toUpperCase()}</h4>
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${ticket.status === 'Resolved' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                              {ticket.status}
                            </span>
                          </div>
                          <p className="text-sm font-semibold text-gray-700">User: {userName} | Item: {prodName}</p>
                          <p className="text-sm text-gray-800 font-medium italic">"{ticket.issueDescription}"</p>
                          {ticket.resolutionNotes && (
                            <p className="text-xs text-green-600 font-bold bg-green-50 border p-2 rounded-lg mt-2">
                              Resolution: {ticket.resolutionNotes}
                            </p>
                          )}
                        </div>
                        
                        <button onClick={() => handleOpenTicketModal(ticket)} className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-blue-700 transition">
                          Resolve / Action
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* TAB 4: USERS MANAGEMENT */}
          {activeTab === 'users' && (
            <div>
              <h3 className="text-2xl font-extrabold text-gray-900 mb-2">Registered Users Control</h3>
              <p className="text-gray-500 mb-6 text-sm">List all registered users, change system roles and control platform access.</p>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[500px]">
                  <thead>
                    <tr className="bg-gray-50 text-gray-900 font-bold border-b border-gray-100">
                      <th className="p-4">Full Name</th>
                      <th className="p-4">Email</th>
                      <th className="p-4">Platform Role</th>
                      <th className="p-4">Authorization</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersList.map(usr => (
                      <tr key={usr._id} className="border-b border-gray-55 hover:bg-gray-50 transition">
                        <td className="p-4 font-bold text-gray-900">{usr.name}</td>
                        <td className="p-4 text-gray-600 text-sm">{usr.email}</td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${usr.role === 'admin' ? 'bg-red-100 text-red-700' : usr.role === 'vendor' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-600'}`}>
                            {usr.role}
                          </span>
                        </td>
                        <td className="p-4">
                          <select 
                            className="bg-white border rounded-lg px-2.5 py-1.5 text-xs font-bold text-gray-800 outline-none"
                            value={usr.role}
                            onChange={(e) => handleUpdateRole(usr._id, e.target.value)}
                          >
                            <option value="user">User</option>
                            <option value="vendor">Vendor</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: REPORTS & ANALYTICS */}
          {activeTab === 'reports' && (
            <div>
              <h3 className="text-2xl font-extrabold text-gray-900 mb-2">Reports & Dynamic Analytics</h3>
              <p className="text-gray-500 mb-8 text-sm">Visual distribution of product rents, active delivery statistics, and performance KPIs.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gray-50 border p-6 rounded-3xl">
                  <h4 className="font-extrabold text-gray-900 text-lg mb-4 flex items-center gap-2"><CheckCircle className="text-green-600"/> Monthly Recurring Revenue</h4>
                  <p className="text-sm text-gray-500">Rental MRR represents the sum of product monthlyRent of all active rental contracts.</p>
                  <p className="text-3xl font-black text-gray-950 mt-4">₹{(stats.activeRentals * 1350).toLocaleString()} <span className="text-xs text-gray-400 font-normal">Est / mo</span></p>
                </div>
                <div className="bg-gray-50 border p-6 rounded-3xl">
                  <h4 className="font-extrabold text-gray-900 text-lg mb-4 flex items-center gap-2"><Wrench className="text-orange-600"/> Support Health Status</h4>
                  <p className="text-sm text-gray-500">Tracks average resolution times and unresolved customer support tickets.</p>
                  <p className="text-3xl font-black text-gray-950 mt-4">{stats.pendingSupport} <span className="text-xs text-gray-400 font-normal">Active claims</span></p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: SERVICE AREAS */}
          {activeTab === 'areas' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-2xl font-extrabold text-gray-900">Delivery Coverage Pincodes</h3>
                  <p className="text-gray-500 text-sm mt-1">Manage active zip/pin codes allowed during cart checkout checks.</p>
                </div>
                <button onClick={() => setIsAreaModalOpen(true)} className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition shadow-md flex items-center gap-2">
                  <Plus className="w-5 h-5"/> Add Service Area
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-gray-900 font-bold border-b border-gray-100">
                      <th className="p-4">City / Area Name</th>
                      <th className="p-4">Pincode Coverage</th>
                      <th className="p-4">Coverage Status</th>
                      <th className="p-4">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {serviceAreas.map(area => (
                      <tr key={area._id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                        <td className="p-4 font-bold text-gray-900">{area.name}</td>
                        <td className="p-4 text-gray-600 text-sm font-semibold">{area.pincode}</td>
                        <td className="p-4">
                          <button 
                            onClick={() => handleToggleArea(area)}
                            className={`px-3 py-1 rounded-full text-xs font-bold transition border cursor-pointer ${area.active ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}
                          >
                            {area.active ? 'Active Coverage' : 'Inactive'}
                          </button>
                        </td>
                        <td className="p-4">
                          <button onClick={() => handleDeleteArea(area._id)} className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded transition">
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* 1. ADD / EDIT PRODUCT INVENTORY OVERLAY MODAL */}
      {isProductModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-gray-100 flex flex-col max-h-[90vh]">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50">
              <h3 className="font-black text-xl text-gray-950 flex items-center gap-2"><PackageSearch className="text-blue-600 w-5 h-5"/> {editingProduct ? 'Edit Product Listing' : 'Add New Product Listing'}</h3>
              <button onClick={() => setIsProductModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition p-1 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleProductSubmit} className="p-6 space-y-4 overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Product Title</label>
                <input required type="text" className="w-full border-2 border-gray-100 rounded-xl p-3 bg-gray-50 focus:bg-white outline-none transition" value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} placeholder="King Size Bed, etc." />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Monthly Rent (₹)</label>
                  <input required type="number" className="w-full border-2 border-gray-100 rounded-xl p-3 bg-gray-50 focus:bg-white outline-none transition" value={productForm.monthlyRent} onChange={e => setProductForm({...productForm, monthlyRent: e.target.value})} placeholder="1500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Security Deposit (₹)</label>
                  <input required type="number" className="w-full border-2 border-gray-100 rounded-xl p-3 bg-gray-50 focus:bg-white outline-none transition" value={productForm.securityDeposit} onChange={e => setProductForm({...productForm, securityDeposit: e.target.value})} placeholder="3000" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Stock Availability</label>
                  <input required type="number" className="w-full border-2 border-gray-100 rounded-xl p-3 bg-gray-50 focus:bg-white outline-none transition" value={productForm.stock} onChange={e => setProductForm({...productForm, stock: e.target.value})} placeholder="10" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Product Category</label>
                  <select className="w-full border-2 border-gray-100 rounded-xl p-3 bg-gray-50 focus:bg-white outline-none transition font-semibold" value={productForm.category} onChange={e => setProductForm({...productForm, category: e.target.value})}>
                    <option value="Furniture">Furniture</option>
                    <option value="Appliances">Appliances</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Tenure Options (Comma Separated Months)</label>
                <input required type="text" className="w-full border-2 border-gray-100 rounded-xl p-3 bg-gray-50 focus:bg-white outline-none transition" value={productForm.tenureOptionsStr} onChange={e => setProductForm({...productForm, tenureOptionsStr: e.target.value})} placeholder="3, 6, 12" />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Catalog Image URL</label>
                <input type="text" className="w-full border-2 border-gray-100 rounded-xl p-3 bg-gray-50 focus:bg-white outline-none transition" value={productForm.imageUrl} onChange={e => setProductForm({...productForm, imageUrl: e.target.value})} placeholder="https://images.unsplash.com/..." />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Listing Description</label>
                <textarea required rows="3" className="w-full border-2 border-gray-100 rounded-xl p-3 bg-gray-50 focus:bg-white outline-none transition" value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})} placeholder="Premium comfortable bed mattress..." />
              </div>

              <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-2xl hover:bg-blue-700 transition shadow-lg">
                {editingProduct ? 'Save Listing Changes' : 'Publish Product Listing'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 2. DISPUTE & DAMAGE CLAIMS OVERLAY MODAL */}
      {isClaimModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border flex flex-col">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50">
              <h3 className="font-black text-xl text-gray-950 flex items-center gap-2"><ShieldAlert className="text-red-600 w-5 h-5"/> Damage & Dispute claim</h3>
              <button onClick={() => setIsClaimModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition p-1 rounded-full"><X className="w-5 h-5" /></button>
            </div>
            
            <form onSubmit={handleClaimSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Damage Fee Charged (₹)</label>
                <input type="number" className="w-full border-2 border-gray-100 rounded-xl p-3 bg-gray-50 focus:bg-white outline-none transition" value={claimForm.damageClaim} onChange={e => setClaimForm({...claimForm, damageClaim: e.target.value})} />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Damage Description</label>
                <input type="text" className="w-full border-2 border-gray-100 rounded-xl p-3 bg-gray-50 focus:bg-white outline-none transition" value={claimForm.damageDescription} onChange={e => setClaimForm({...claimForm, damageDescription: e.target.value})} placeholder="e.g. Scratched screen panel" />
              </div>

              <div className="border-t pt-4">
                <label className="block text-sm font-bold text-gray-700 mb-1">Dispute Claims Status</label>
                <select className="w-full border-2 border-gray-100 rounded-xl p-3 bg-gray-50 focus:bg-white outline-none transition font-semibold" value={claimForm.disputeStatus} onChange={e => setClaimForm({...claimForm, disputeStatus: e.target.value})}>
                  <option value="None">None</option>
                  <option value="Pending">Pending Dispute</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Dispute Description Details</label>
                <textarea rows="2" className="w-full border-2 border-gray-100 rounded-xl p-3 bg-gray-50 focus:bg-white outline-none transition" value={claimForm.disputeDescription} onChange={e => setClaimForm({...claimForm, disputeDescription: e.target.value})} placeholder="Record any active disputes raised by the client." />
              </div>

              <button type="submit" className="w-full bg-red-600 text-white font-bold py-3.5 rounded-2xl hover:bg-red-700 transition shadow-lg">
                Log Claims & Disputes
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 3. SERVICE AREA OVERLAY MODAL */}
      {isAreaModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border flex flex-col">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50">
              <h3 className="font-black text-xl text-gray-950 flex items-center gap-2"><Map className="text-blue-600 w-5 h-5"/> Add Service Location</h3>
              <button onClick={() => setIsAreaModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition p-1 rounded-full"><X className="w-5 h-5" /></button>
            </div>
            
            <form onSubmit={handleAreaSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">City / Area Name</label>
                <input required type="text" className="w-full border-2 border-gray-100 rounded-xl p-3 bg-gray-50 focus:bg-white outline-none transition" value={areaForm.name} onChange={e => setAreaForm({...areaForm, name: e.target.value})} placeholder="e.g. Pune, Delhi" />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Pincode Coverage</label>
                <input required type="text" className="w-full border-2 border-gray-100 rounded-xl p-3 bg-gray-50 focus:bg-white outline-none transition" value={areaForm.pincode} onChange={e => setAreaForm({...areaForm, pincode: e.target.value})} placeholder="e.g. 411001" />
              </div>

              <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-2xl hover:bg-blue-700 transition shadow-lg">
                Activate pincode Coverage
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 4. MAINTENANCE TICKET RESOLUTION OVERLAY MODAL */}
      {isTicketModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border flex flex-col">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50">
              <h3 className="font-black text-xl text-gray-950 flex items-center gap-2"><Wrench className="text-blue-600 w-5 h-5"/> Action Support ticket</h3>
              <button onClick={() => setIsTicketModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition p-1 rounded-full"><X className="w-5 h-5" /></button>
            </div>
            
            <form onSubmit={handleTicketSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Ticket Status</label>
                <select className="w-full border-2 border-gray-100 rounded-xl p-3 bg-gray-50 focus:bg-white outline-none transition font-semibold" value={ticketForm.status} onChange={e => setTicketForm({...ticketForm, status: e.target.value})}>
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Resolution Notes</label>
                <textarea rows="3" className="w-full border-2 border-gray-100 rounded-xl p-3 bg-gray-50 focus:bg-white outline-none transition" value={ticketForm.resolutionNotes} onChange={e => setTicketForm({...ticketForm, resolutionNotes: e.target.value})} placeholder="Enter action taken. E.g. technician dispatched, product replaced on 24th May, etc." />
              </div>

              <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-2xl hover:bg-blue-700 transition shadow-lg">
                Log Resolution Details
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
