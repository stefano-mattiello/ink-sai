use brush::traits::AccountId;
//use ink_storage::traits::{PackedLayout, SpreadLayout};

//#[cfg(feature = "std")]
//use ink_storage::traits::StorageLayout;
#[brush::wrapper]
pub type PitTraitRef = dyn PitTrait;

#[brush::trait_definition]
pub trait PitTrait {
    #[ink(message)]
    fn burn(&self, gem_address: AccountId);
}
