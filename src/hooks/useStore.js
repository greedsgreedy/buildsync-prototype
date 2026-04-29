// src/hooks/useStore.js
// Central state hook — replace with Zustand or Supabase in v2

import { useState, useCallback, useEffect, useRef } from 'react';
import { INSTALLED_MODS, PARTS, minPrice } from '../data';
import { supabase } from '../lib/supabase';

const DEFAULT_ALERTS = [
  { id:1, part:'Pure Stage 2 Turbo', type:'restock' },
  { id:2, part:'Volk TE37 Saga 18x10', type:'drop' },
  { id:3, part:'Akrapovic Titanium Cat-Back', type:'watch' },
];

const DEFAULT_VEHICLES = [
  {
    id: 1,
    year: '2021',
    make: 'Toyota',
    model: 'Supra',
    trim: 'A90',
    type: 'Coupe',
    engine: 'B58 3.0T',
    color: 'Nitro Yellow',
    nickname: 'Nitro A90',
    bio: 'Street-focused build with clean power, stance, and daily usability.',
    socials: { instagram:'', tiktok:'', youtube:'', buildThread:'' },
    fitment: {
      vin: '',
      vinDecoded: false,
      transmission: 'AT8',
      brakePackage: 'Stock',
      drivetrain: 'RWD',
      emissions: 'US',
    },
    usageProfile: {
      style: 'street',
      climate: 'temperate',
      currentMileage: 27000,
    },
    serviceLog: {
      oilLast: 24000,
      brakeFluidLast: 21000,
      transFluidLast: 15000,
      coolantLast: 18000,
    },
    photos: [],
    installedMods: INSTALLED_MODS,
    wishlist: [],
    alerts: DEFAULT_ALERTS,
  },
];

const STORE_KEY = 'buildsync.v1.store';
const DEFAULT_ACCOUNT = {
  mode: 'guest',
  name: 'Guest',
  email: '',
  cloudSync: false,
  lastSyncedAt: '',
};
const DEFAULT_CATALOG_FEED = [];
const GARAGE_ROW_ID = 'primary';

const safeParse = (raw) => {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const readPersistedStore = () => {
  if (typeof window === 'undefined') return null;
  const parsed = safeParse(window.localStorage.getItem(STORE_KEY) || '');
  if (!parsed || parsed.version !== 1) return null;
  return parsed;
};

const createInitialState = () => {
  const persisted = readPersistedStore();
  if (!persisted) {
    return {
      vehicles: DEFAULT_VEHICLES,
      activeVehicleId: DEFAULT_VEHICLES[0].id,
      likedBuilds: new Set(),
      account: DEFAULT_ACCOUNT,
      catalogFeed: DEFAULT_CATALOG_FEED,
      appScope: 'supra_bmw',
    };
  }

  const vehicles = persisted.vehicles?.length ? persisted.vehicles : DEFAULT_VEHICLES;
  const firstId = vehicles[0]?.id || DEFAULT_VEHICLES[0].id;
  const activeVehicleId = vehicles.some(v => v.id === persisted.activeVehicleId)
    ? persisted.activeVehicleId
    : firstId;

  return {
    vehicles,
    activeVehicleId,
    likedBuilds: new Set(persisted.likedBuilds || []),
    account: { ...DEFAULT_ACCOUNT, ...(persisted.account || {}) },
    catalogFeed: Array.isArray(persisted.catalogFeed) ? persisted.catalogFeed : DEFAULT_CATALOG_FEED,
    appScope: persisted.appScope || 'supra_bmw',
  };
};

export function useStore() {
  const initial = createInitialState();
  const [vehicles, setVehicles] = useState(initial.vehicles);
  const [activeVehicleId, setActiveVehicleId] = useState(initial.activeVehicleId);
  const [likedBuilds, setLikedBuilds] = useState(initial.likedBuilds);
  const [account, setAccount] = useState(initial.account);
  const [catalogFeed, setCatalogFeed] = useState(initial.catalogFeed);
  const [appScope, setAppScope] = useState(initial.appScope);
  const [authUser, setAuthUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const writeGuardRef = useRef(new Map());

  const activeVehicle = vehicles.find(v => v.id === activeVehicleId) || vehicles[0];
  const installedMods = activeVehicle?.installedMods || [];
  const wishlist = activeVehicle?.wishlist || [];
  const alerts = activeVehicle?.alerts || [];

  const logAudit = useCallback(async (action, details = {}) => {
    if (!authUser?.id) return;
    await supabase.from('audit_logs').insert([{
      user_id: authUser.id,
      action,
      details,
      created_at: new Date().toISOString(),
    }]);
  }, [authUser?.id]);

  const updateActiveVehicle = useCallback((updater) => {
    setVehicles(prev => prev.map(vehicle => (
      vehicle.id === activeVehicleId ? updater(vehicle) : vehicle
    )));
  }, [activeVehicleId]);

  const addVehicle = useCallback((vehicle) => {
    const id = Date.now();
    const nextVehicle = {
      id,
      year: vehicle.year || '',
      make: vehicle.make || '',
      model: vehicle.model || '',
      trim: vehicle.trim || '',
      type: vehicle.type || '',
      engine: vehicle.engine || '',
      color: vehicle.color || '',
      nickname: vehicle.nickname || '',
      bio: vehicle.bio || '',
      socials: vehicle.socials || { instagram:'', tiktok:'', youtube:'', buildThread:'' },
      fitment: vehicle.fitment || {
        vin: '',
        vinDecoded: false,
        transmission: 'AT8',
        brakePackage: 'Stock',
        drivetrain: 'RWD',
        emissions: 'US',
      },
      usageProfile: vehicle.usageProfile || {
        style: 'street',
        climate: 'temperate',
        currentMileage: 0,
      },
      serviceLog: vehicle.serviceLog || {
        oilLast: 0,
        brakeFluidLast: 0,
        transFluidLast: 0,
        coolantLast: 0,
      },
      photos: vehicle.photos || [],
      installedMods: [],
      wishlist: [],
      alerts: [],
    };
    setVehicles(prev => [...prev, nextVehicle]);
    setActiveVehicleId(id);
  }, []);

  const removeVehicle = useCallback((id) => {
    setVehicles(prev => {
      if (prev.length <= 1) return prev;
      const remaining = prev.filter(vehicle => vehicle.id !== id);
      if (id === activeVehicleId && remaining.length) {
        setActiveVehicleId(remaining[0].id);
      }
      return remaining;
    });
  }, [activeVehicleId]);

  const updateVehicleProfile = useCallback((profile) => {
    updateActiveVehicle(vehicle => ({
      ...vehicle,
      ...profile,
      socials: { ...vehicle.socials, ...(profile.socials || {}) },
      fitment: { ...vehicle.fitment, ...(profile.fitment || {}) },
      usageProfile: { ...vehicle.usageProfile, ...(profile.usageProfile || {}) },
      serviceLog: { ...vehicle.serviceLog, ...(profile.serviceLog || {}) },
    }));
  }, [updateActiveVehicle]);

  const addVehiclePhoto = useCallback((photo) => {
    updateActiveVehicle(vehicle => ({
      ...vehicle,
      photos: [...(vehicle.photos || []), { ...photo, id: Date.now() }],
    }));
  }, [updateActiveVehicle]);

  const removeVehiclePhoto = useCallback((id) => {
    updateActiveVehicle(vehicle => ({
      ...vehicle,
      photos: (vehicle.photos || []).filter(photo => photo.id !== id),
    }));
  }, [updateActiveVehicle]);

  const passWriteGuard = useCallback((key, minGapMs = 300) => {
    const now = Date.now();
    const last = writeGuardRef.current.get(key) || 0;
    if (now - last < minGapMs) return false;
    writeGuardRef.current.set(key, now);
    return true;
  }, []);

  // --- Wishlist ---
  const toggleWishlist = useCallback((part) => {
    if (!passWriteGuard('wishlist:toggle')) return;
    updateActiveVehicle(vehicle => {
      const exists = vehicle.wishlist.find(w => w.id === part.id);
      const wishlist = exists
        ? vehicle.wishlist.filter(w => w.id !== part.id)
        : [...vehicle.wishlist, { id: part.id, name: part.name, price: minPrice(part.vendors), cat: part.cat }];
      return { ...vehicle, wishlist };
    });
    logAudit('wishlist_toggle', { vehicleId: activeVehicleId, partId: part.id, name: part.name });
  }, [updateActiveVehicle, passWriteGuard, logAudit, activeVehicleId]);

  const removeFromWishlist = useCallback((id) => {
    if (!passWriteGuard('wishlist:remove')) return;
    updateActiveVehicle(vehicle => ({
      ...vehicle,
      wishlist: vehicle.wishlist.filter(w => w.id !== id),
    }));
    logAudit('wishlist_remove', { vehicleId: activeVehicleId, partId: id });
  }, [updateActiveVehicle, passWriteGuard, logAudit, activeVehicleId]);

  const isInWishlist = useCallback((id) => wishlist.some(w => w.id === id), [wishlist]);

  // --- Mods ---
  const addMod = useCallback((mod) => {
    if (!passWriteGuard('mod:add')) return;
    updateActiveVehicle(vehicle => ({
      ...vehicle,
      installedMods: [...vehicle.installedMods, { ...mod, id: Date.now() }],
    }));
    logAudit('mod_add', { vehicleId: activeVehicleId, name: mod.name, cat: mod.cat });
  }, [updateActiveVehicle, passWriteGuard, logAudit, activeVehicleId]);

  const removeMod = useCallback((id) => {
    if (!passWriteGuard('mod:remove')) return;
    updateActiveVehicle(vehicle => ({
      ...vehicle,
      installedMods: vehicle.installedMods.filter(m => m.id !== id),
    }));
    logAudit('mod_remove', { vehicleId: activeVehicleId, modId: id });
  }, [updateActiveVehicle, passWriteGuard, logAudit, activeVehicleId]);

  // --- Alerts ---
  const addAlert = useCallback((alert) => {
    if (!passWriteGuard('alert:add')) return;
    updateActiveVehicle(vehicle => ({
      ...vehicle,
      alerts: [...vehicle.alerts, { ...alert, id: Date.now() }],
    }));
    logAudit('alert_add', { vehicleId: activeVehicleId, type: alert.type, part: alert.part });
  }, [updateActiveVehicle, passWriteGuard, logAudit, activeVehicleId]);

  const removeAlert = useCallback((id) => {
    if (!passWriteGuard('alert:remove')) return;
    updateActiveVehicle(vehicle => ({
      ...vehicle,
      alerts: vehicle.alerts.filter(a => a.id !== id),
    }));
    logAudit('alert_remove', { vehicleId: activeVehicleId, alertId: id });
  }, [updateActiveVehicle, passWriteGuard, logAudit, activeVehicleId]);

  const quickAlert = useCallback((partName) => {
    if (!passWriteGuard('alert:quick')) return;
    updateActiveVehicle(vehicle => ({
      ...vehicle,
      alerts: [...vehicle.alerts, { id: Date.now(), part: partName, type: 'watch' }],
    }));
    logAudit('alert_quick_add', { vehicleId: activeVehicleId, part: partName });
  }, [updateActiveVehicle, passWriteGuard, logAudit, activeVehicleId]);

  // --- Community ---
  const toggleLike = useCallback((buildId) => {
    setLikedBuilds(prev => {
      const next = new Set(prev);
      if (next.has(buildId)) next.delete(buildId);
      else next.add(buildId);
      return next;
    });
  }, []);

  // --- Computed ---
  const totalSpent = installedMods.reduce((s, m) => s + (m.price || 0), 0);
  const wishlistTotal = wishlist.reduce((s, w) => s + (w.price || 0), 0);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const payload = {
      version: 1,
      vehicles,
      activeVehicleId,
      likedBuilds: [...likedBuilds],
      account,
      catalogFeed,
      appScope,
    };
    window.localStorage.setItem(STORE_KEY, JSON.stringify(payload));
  }, [vehicles, activeVehicleId, likedBuilds, account, catalogFeed, appScope]);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setAuthUser(data.session?.user || null);
      setAuthLoading(false);
    });
    const { data: authSub } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthUser(session?.user || null);
      setAuthLoading(false);
    });
    return () => {
      mounted = false;
      authSub.subscription.unsubscribe();
    };
  }, []);

  const upgradeToAccount = useCallback(({ name, email }) => {
    setAccount(prev => ({
      ...prev,
      mode: 'account',
      name: name?.trim() || prev.name || 'Driver',
      email: email?.trim() || prev.email,
    }));
  }, []);

  const setGuestMode = useCallback(() => {
    setAccount(prev => ({ ...prev, mode: 'guest', cloudSync: false }));
  }, []);

  const toggleCloudSync = useCallback(() => {
    setAccount(prev => ({
      ...prev,
      cloudSync: !prev.cloudSync,
      lastSyncedAt: new Date().toISOString(),
    }));
  }, []);

  const createSyncBundle = useCallback(() => {
    const payload = {
      version: 1,
      createdAt: new Date().toISOString(),
      account,
      vehicles,
      activeVehicleId,
      likedBuilds: [...likedBuilds],
    };
    return btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
  }, [account, vehicles, activeVehicleId, likedBuilds]);

  const restoreSyncBundle = useCallback((bundle) => {
    try {
      const json = decodeURIComponent(escape(atob(bundle.trim())));
      const parsed = safeParse(json);
      if (!parsed || parsed.version !== 1 || !Array.isArray(parsed.vehicles) || !parsed.vehicles.length) {
        return { ok: false, error: 'Invalid bundle' };
      }
      setVehicles(parsed.vehicles);
      setActiveVehicleId(parsed.activeVehicleId || parsed.vehicles[0].id);
      setLikedBuilds(new Set(parsed.likedBuilds || []));
      setAccount({ ...DEFAULT_ACCOUNT, ...(parsed.account || {}), lastSyncedAt: new Date().toISOString() });
      setCatalogFeed(Array.isArray(parsed.catalogFeed) ? parsed.catalogFeed : DEFAULT_CATALOG_FEED);
      setAppScope(parsed.appScope || 'supra_bmw');
      return { ok: true };
    } catch {
      return { ok: false, error: 'Could not decode bundle' };
    }
  }, []);

  const importCatalogFeedRows = useCallback((rows) => {
    if (!Array.isArray(rows)) return;
    setCatalogFeed(rows.map((row, idx) => ({
      id: row.id || `${Date.now()}-${idx}`,
      part: row.part || row.part_name || '',
      brand: row.brand || '',
      vendor: row.vendor || row.vendor_name || '',
      price: Number(row.price || 0),
      shipping: Number(row.shipping || 0),
      url: row.url || row.link || '',
      fitment: row.fitment || '',
      updatedAt: row.updatedAt || new Date().toISOString(),
    })).filter(row => row.part && row.vendor && Number.isFinite(row.price)));
  }, []);

  const clearCatalogFeed = useCallback(() => setCatalogFeed(DEFAULT_CATALOG_FEED), []);

  const signInWithEmailOtp = useCallback(async (email) => {
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  }, []);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  }, []);

  const saveCloudGarage = useCallback(async () => {
    if (!authUser?.id) return { ok: false, error: 'Sign in required' };
    const payload = {
      user_id: authUser.id,
      garage_id: GARAGE_ROW_ID,
      vehicles,
      active_vehicle_id: activeVehicleId,
      liked_builds: [...likedBuilds],
      catalog_feed: catalogFeed,
      app_scope: appScope,
      updated_at: new Date().toISOString(),
    };
    const { error } = await supabase
      .from('garage_profiles')
      .upsert(payload, { onConflict: 'user_id,garage_id' });
    if (error) return { ok: false, error: error.message };
    await logAudit('garage_save', { vehicleCount: vehicles.length });
    setAccount(prev => ({ ...prev, cloudSync: true, lastSyncedAt: new Date().toISOString() }));
    return { ok: true };
  }, [authUser?.id, vehicles, activeVehicleId, likedBuilds, catalogFeed, appScope, logAudit]);

  const loadCloudGarage = useCallback(async () => {
    if (!authUser?.id) return { ok: false, error: 'Sign in required' };
    const { data, error } = await supabase
      .from('garage_profiles')
      .select('*')
      .eq('user_id', authUser.id)
      .eq('garage_id', GARAGE_ROW_ID)
      .maybeSingle();
    if (error) return { ok: false, error: error.message };
    if (!data) return { ok: true, empty: true };
    const nextVehicles = Array.isArray(data.vehicles) && data.vehicles.length ? data.vehicles : DEFAULT_VEHICLES;
    setVehicles(nextVehicles);
    setActiveVehicleId(data.active_vehicle_id || nextVehicles[0].id);
    setLikedBuilds(new Set(data.liked_builds || []));
    setCatalogFeed(Array.isArray(data.catalog_feed) ? data.catalog_feed : DEFAULT_CATALOG_FEED);
    setAppScope(data.app_scope || 'supra_bmw');
    setAccount(prev => ({ ...prev, cloudSync: true, lastSyncedAt: new Date().toISOString() }));
    return { ok: true };
  }, [authUser?.id]);

  const uploadVehiclePhoto = useCallback(async (file) => {
    if (!file) return { ok: false, error: 'No file selected' };
    if (!authUser?.id) return { ok: false, error: 'Sign in required for cloud upload' };
    const allowedTypes = ['image/png', 'image/jpeg', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return { ok: false, error: 'Only PNG, JPG, JPEG, or WEBP files are allowed' };
    }
    const compressImage = (inputFile, maxWidth = 1600, quality = 0.82) => new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const ratio = Math.min(1, maxWidth / img.width);
        const w = Math.round(img.width * ratio);
        const h = Math.round(img.height * ratio);
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('Canvas unavailable'));
        ctx.drawImage(img, 0, 0, w, h);
        canvas.toBlob((blob) => {
          if (!blob) return reject(new Error('Compression failed'));
          resolve(blob);
        }, 'image/jpeg', quality);
      };
      img.onerror = () => reject(new Error('Image load failed'));
      img.src = URL.createObjectURL(inputFile);
    });
    try {
      const compressed = await compressImage(file);
      if (compressed.size > 4 * 1024 * 1024) {
        return { ok: false, error: 'Compressed image too large (max 4MB)' };
      }
      const path = `${authUser.id}/${activeVehicleId}/${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`;
      const { error: uploadError } = await supabase.storage.from('vehicle-photos').upload(path, compressed, {
        contentType: 'image/jpeg',
        upsert: false,
      });
      if (uploadError) return { ok: false, error: uploadError.message };
      const { data } = supabase.storage.from('vehicle-photos').getPublicUrl(path);
      const photo = { id: Date.now(), url: data?.publicUrl || '', name: file.name, path };
      addVehiclePhoto(photo);
      await logAudit('photo_upload', { vehicleId: activeVehicleId, path, sourceName: file.name });
      return { ok: true, photo };
    } catch (error) {
      return { ok: false, error: error.message || 'Upload failed' };
    }
  }, [authUser?.id, activeVehicleId, addVehiclePhoto, logAudit]);

  const auditAction = useCallback((action, details = {}) => {
    if (!passWriteGuard(`audit:${action}`, 200)) return;
    logAudit(action, details);
  }, [logAudit, passWriteGuard]);

  return {
    vehicles, activeVehicle, activeVehicleId, setActiveVehicleId, addVehicle, removeVehicle,
    updateVehicleProfile, addVehiclePhoto, removeVehiclePhoto,
    installedMods, addMod, removeMod,
    wishlist, toggleWishlist, removeFromWishlist, isInWishlist, wishlistTotal,
    alerts, addAlert, removeAlert, quickAlert,
    likedBuilds, toggleLike,
    catalogFeed, importCatalogFeedRows, clearCatalogFeed,
    appScope, setAppScope,
    account, upgradeToAccount, setGuestMode, toggleCloudSync, createSyncBundle, restoreSyncBundle,
    authUser, authLoading, signInWithEmailOtp, signOut, saveCloudGarage, loadCloudGarage, uploadVehiclePhoto, logAudit, auditAction,
    totalSpent,
  };
}
