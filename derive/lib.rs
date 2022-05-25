#![cfg_attr(not(feature = "std"), no_std)]

extern crate proc_macro;

use brush_derive::declare_derive_storage_trait;

declare_derive_storage_trait!(derive_vox_storage, VoxStorage, VoxStorageField);
declare_derive_storage_trait!(derive_tub_storage, TubStorage, TubStorageField);
declare_derive_storage_trait!(derive_mom_storage, MomStorage, MomStorageField);
declare_derive_storage_trait!(derive_tap_storage, TapStorage, TapStorageField);
declare_derive_storage_trait!(derive_top_storage, TopStorage, TopStorageField);
declare_derive_storage_trait!(
    derive_somemath_storage,
    SomeMathStorage,
    SomeMathStorageField
);
