use brush::contracts::traits::access_control::*;
use brush::traits::Timestamp;
//use ink_storage::traits::{PackedLayout, SpreadLayout};

//use ink_storage::traits::StorageLayout;

//#[cfg(feature = "std")]
#[brush::wrapper]
pub type VoxTraitRef = dyn VoxTrait + AccessControl;

#[brush::trait_definition]
pub trait VoxTrait: AccessControl {
    /// This function initalizes data of a loan and mint token inside it
    #[ink(message)]
    fn era(&self) -> Timestamp;
    /// This function frees data of a loan and burn token inside it
    #[ink(message)]
    fn mold(&mut self, val: u128) -> Result<(), AccessControlError>;

    /// This function will be used when the user repays their loan only partially
    #[ink(message)]
    fn get_par(&mut self) -> u128;

    #[ink(message)]
    fn get_way(&mut self) -> u128;

    #[ink(message)]
    fn tell(&mut self, ray: u128) -> Result<(), AccessControlError>;

    #[ink(message)]
    fn tune(&mut self, ray: u128) -> Result<(), AccessControlError>;

    /// This function will set a loan to liquidated
    #[ink(message)]
    fn prod(&mut self);

    fn _inj(&self, x: i128) -> u128;
    fn _prj(&self, x: u128) -> i128;
}
