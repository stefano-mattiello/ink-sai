#![cfg_attr(not(feature = "std"), no_std)]
#![feature(min_specialization)]

pub mod impls;
pub mod traits;
pub use ink_sai_derive::*;
