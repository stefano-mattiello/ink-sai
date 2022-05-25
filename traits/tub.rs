use brush::contracts::traits::access_control::*;
use brush::contracts::traits::psp22::*;
use brush::traits::{AccountId, Balance, Timestamp};
use ink_storage::traits::{PackedLayout, SpreadLayout};

#[cfg(feature = "std")]
use ink_storage::traits::StorageLayout;
#[derive(Default, Debug, Clone, scale::Encode, scale::Decode, SpreadLayout, PackedLayout)]
#[cfg_attr(feature = "std", derive(StorageLayout, scale_info::TypeInfo))]
pub struct Cup {
    pub lad: AccountId,
    pub ink: Balance,
    pub art: Balance,
    pub ire: Balance,
}
#[brush::wrapper]
pub type TubTraitRef = dyn TubTrait + AccessControl;

#[brush::trait_definition]
pub trait TubTrait: AccessControl {
    /// This function initalizes data of a loan and mint token inside it
    #[ink(message)]
    fn era(&self) -> Timestamp;
    #[ink(message)]
    fn get_mat(&self) -> u128;
    #[ink(message)]
    fn get_tax(&self) -> u128;
    #[ink(message)]
    fn get_fee(&self) -> u128;
    #[ink(message)]
    fn get_axe(&self) -> u128;
    #[ink(message)]
    fn get_gem(&self) -> AccountId;
    #[ink(message)]
    fn get_sai(&self) -> AccountId;
    #[ink(message)]
    fn get_sin(&self) -> AccountId;
    #[ink(message)]
    fn get_skr(&self) -> AccountId;
    #[ink(message)]
    fn get_vox(&self) -> AccountId;
    #[ink(message)]
    fn get_off(&self) -> bool;
    #[ink(message)]
    fn get_out(&self) -> bool;
    #[ink(message)]
    fn get_gap(&self) -> u128;
    #[ink(message)]
    fn get_pip(&self) -> AccountId;
    #[ink(message)]
    fn lad(&self, cup: u128) -> AccountId;
    #[ink(message)]
    fn ink(&self, cup: u128) -> Balance;
    #[ink(message)]
    fn get_rum(&self) -> u128;
	
    #[ink(message)]
    fn art(&self, cup: u128) -> Balance;
    #[ink(message)]
    fn ire(&self, cup: u128) -> Balance;
    #[ink(message)]
    fn tab(&mut self, cup: u128) -> Balance;
    #[ink(message)]
    fn rap(&mut self, cup: u128) -> Balance;

    #[ink(message)]
    fn din(&mut self) -> Balance;

    /// This function frees data of a loan and burn token inside it
    #[ink(message)]
    fn air(&self) -> Balance;

    #[ink(message)]
    fn pie(&self) -> Balance;

    #[ink(message)]
    fn mold(&mut self, param: u8, val: u128) -> Result<(), TubError>;

    #[ink(message)]
    fn set_pip(&mut self, pip_address: AccountId) -> Result<(), TubError>;

    #[ink(message)]
    fn set_pep(&mut self, pep_address: AccountId) -> Result<(), TubError>;

    #[ink(message)]
    fn set_vox(&mut self, vox_address: AccountId) -> Result<(), TubError>;

    #[ink(message)]
    fn turn(&mut self, tap_address: AccountId) -> Result<(), TubError>;

    #[ink(message)]
    fn per(&self) -> u128;

    #[ink(message)]
    fn ask(&self, wad: u128) -> u128;

    #[ink(message)]
    fn bid(&self, wad: u128) -> u128;

    #[ink(message)]
    fn join(&mut self, wad: u128) -> Result<(), TubError>;

    #[ink(message)]
    fn exit(&mut self, wad: u128) -> Result<(), TubError>;

    #[ink(message)]
    fn get_chi(&mut self) -> Result<u128, TubError>;

    #[ink(message)]
    fn get_rhi(&mut self) -> Result<u128, TubError>;

    #[ink(message)]
    fn drip(&mut self) -> Result<(), TubError>;
    #[ink(message)]
    fn tag(&self) -> u128;

    #[ink(message)]
    fn safe(&mut self, cup: u128) -> bool;

    #[ink(message)]
    fn open(&mut self) -> Result<u128, TubError>;

    #[ink(message)]
    fn give(&mut self, cup: u128, guy: AccountId) -> Result<(), TubError>;

    #[ink(message)]
    fn lock(&mut self, cup: u128, wad: u128) -> Result<(), TubError>;

    #[ink(message)]
    fn free(&mut self, cup: u128, wad: u128) -> Result<(), TubError>;

    #[ink(message)]
    fn draw(&mut self, cup: u128, wad: u128) -> Result<(), TubError>;
    #[ink(message)]
    fn wipe(&mut self, cup: u128, wad: u128) -> Result<(), TubError>;

    #[ink(message)]
    fn shut(&mut self, cup: u128) -> Result<(), TubError>;

    #[ink(message)]
    fn bite(&mut self, cup: u128) -> Result<(), TubError>;

    #[ink(message)]
    fn cage(&mut self, fit: u128, jam: u128) -> Result<(), TubError>;

    #[ink(message)]
    fn flow(&mut self) -> Result<(), TubError>;
}

/// Enum of errors raised by our lending smart contract
#[derive(Debug, PartialEq, Eq, scale::Encode, scale::Decode)]
#[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
pub enum TubError {
    NotEnoughGem,
    InvalidBite,
    InvalidCup,
    CupNotSafe,
    InvalidDraw,
    Paused,
    NotPaused,
    InvalidTurn,
    InvalidCage,
    InvalidGiveCup,
    MoldValueNotValid,
    PSP22Error(PSP22Error),
    AccessControlError(AccessControlError),
}
impl From<AccessControlError> for TubError {
    fn from(access: AccessControlError) -> Self {
        TubError::AccessControlError(access)
    }
}

impl From<PSP22Error> for TubError {
    fn from(error: PSP22Error) -> Self {
        TubError::PSP22Error(error)
    }
}
