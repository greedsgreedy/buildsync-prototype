// src/components/Wishlist.jsx
import { CAT_META } from '../data';
export default function Wishlist({ store }) {
  const { wishlist, removeFromWishlist, wishlistTotal } = store;
  return (
    <div className="tab-content">
      <div className="card">
        <div className="card-title">Saved parts · ${wishlistTotal.toLocaleString()} total</div>
        {wishlist.length === 0 ? (
          <div className="empty-state">No parts saved yet — browse the catalog and hit Save</div>
        ) : wishlist.map(w => {
          const cm = CAT_META[w.cat] || { color:'#1e1e22', text:'#888', label:w.cat };
          return (
            <div key={w.id} className="wish-row">
              <span className="cat-badge" style={{background:cm.color,color:cm.text}}>{cm.label}</span>
              <span className="wish-name">{w.name}</span>
              <span className="wish-price">from ${w.price?.toLocaleString()}</span>
              <button className="rm-btn" onClick={() => removeFromWishlist(w.id)}>Remove</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
