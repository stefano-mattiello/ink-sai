use brush::contracts::traits::access_control::*;
use brush::traits::Timestamp;

#[brush::wrapper]
pub type VoxTraitRef = dyn VoxTrait + AccessControl;

#[brush::trait_definition]
pub trait VoxTrait: AccessControl {
    #[ink(message)]
    fn era(&self) -> Timestamp;
    #[ink(message)]
    fn mold(&mut self, val: u128) -> Result<(), AccessControlError>;

    #[ink(message)]
    fn get_par(&mut self) -> u128;

    #[ink(message)]
    fn get_way(&mut self) -> u128;

    #[ink(message)]
    fn tell(&mut self, ray: u128) -> Result<(), AccessControlError>;

    #[ink(message)]
    fn tune(&mut self, ray: u128) -> Result<(), AccessControlError>;

    #[ink(message)]
    fn prod(&mut self);

    fn _inj(&self, x: i128) -> u128;
    fn _prj(&self, x: u128) -> i128;
}
