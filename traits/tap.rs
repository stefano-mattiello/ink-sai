use brush::contracts::traits::access_control::*;
use brush::contracts::traits::pausable::*;
use brush::contracts::traits::psp22::*;
use brush::traits::Balance;
//use ink_storage::traits::{PackedLayout, SpreadLayout};

//#[cfg(feature = "std")]
//use ink_storage::traits::StorageLayout;
#[brush::wrapper]
pub type TapTraitRef = dyn TapTrait + AccessControl;

#[brush::trait_definition]
pub trait TapTrait: AccessControl {
    #[ink(message)]
    fn joy(&self) -> Balance;

    #[ink(message)]
    fn woe(&self) -> Balance;

    #[ink(message)]
    fn fog(&self) -> Balance;

    #[ink(message)]
    fn mold(&mut self, val: u128) -> Result<(), TapError>;

    #[ink(message)]
    fn heal(&self) -> Result<(), TapError>;

    #[ink(message)]
    fn s2s(&self) -> u128;

    #[ink(message)]
    fn bid(&self, wad: u128) -> u128;

    #[ink(message)]
    fn ask(&self, wad: u128) -> u128;

    fn flip(&self, wad: u128) -> Result<(), TapError>;

    fn flop(&self, wad: u128) -> Result<(), TapError>;

    fn flap(&self, wad: u128) -> Result<(), TapError>;

    #[ink(message)]
    fn bust(&mut self, wad: u128) -> Result<(), TapError>;

    #[ink(message)]
    fn boom(&mut self, wad: u128) -> Result<(), TapError>;

    #[ink(message)]
    fn cage(&mut self, fix: u128) -> Result<(), TapError>;

    #[ink(message)]
    fn cash(&mut self, wad: u128) -> Result<(), TapError>;

    #[ink(message)]
    fn mock(&mut self, wad: u128) -> Result<(), TapError>;

    #[ink(message)]
    fn vent(&mut self) -> Result<(), TapError>;
}

/// Enum of errors raised by our lending smart contract
#[derive(Debug, PartialEq, Eq, scale::Encode, scale::Decode)]
#[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
pub enum TapError {
    InvalidFlop,
    InvalidFlip,
    PausableError(PausableError),
    PSP22Error(PSP22Error),
    AccessControlError(AccessControlError),
}
impl From<AccessControlError> for TapError {
    fn from(access: AccessControlError) -> Self {
        TapError::AccessControlError(access)
    }
}
impl From<PausableError> for TapError {
    fn from(error: PausableError) -> Self {
        TapError::PausableError(error)
    }
}

impl From<PSP22Error> for TapError {
    fn from(error: PSP22Error) -> Self {
        TapError::PSP22Error(error)
    }
}
