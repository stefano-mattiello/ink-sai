use crate::traits::tap::TapError;
use crate::traits::tub::TubError;
use brush::contracts::traits::access_control::*;
use brush::contracts::traits::psp22::*;
use brush::traits::AccountId;

#[brush::wrapper]
pub type MomTraitRef = dyn MomTrait + AccessControl;

#[brush::trait_definition]
pub trait MomTrait: AccessControl {
    #[ink(message)]
    fn set_cap(&mut self, wad: u128) -> Result<(), MomError>;

    #[ink(message)]
    fn set_mat(&mut self, ray: u128) -> Result<(), MomError>;

    #[ink(message)]
    fn set_tax(&mut self, ray: u128) -> Result<(), MomError>;

    #[ink(message)]
    fn set_fee(&mut self, ray: u128) -> Result<(), MomError>;

    #[ink(message)]
    fn set_axe(&mut self, ray: u128) -> Result<(), MomError>;

    #[ink(message)]
    fn set_tub_gap(&mut self, wad: u128) -> Result<(), MomError>;

    #[ink(message)]
    fn set_pip(&mut self, pip_address: AccountId) -> Result<(), MomError>;

    #[ink(message)]
    fn set_pep(&mut self, pep_address: AccountId) -> Result<(), MomError>;

    #[ink(message)]
    fn set_vox(&mut self, vox_address: AccountId) -> Result<(), MomError>;

    #[ink(message)]
    fn set_tap_gap(&mut self, wad: u128) -> Result<(), MomError>;

    #[ink(message)]
    fn set_way(&mut self, ray: u128) -> Result<(), MomError>;

    #[ink(message)]
    fn set_how(&mut self, ray: u128) -> Result<(), MomError>;
}

#[derive(Debug, PartialEq, Eq, scale::Encode, scale::Decode)]
#[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
pub enum MomError {
    InvalidMold,
    TubError(TubError),
    TapError(TapError),
    PSP22Error(PSP22Error),
    AccessControlError(AccessControlError),
}
impl From<AccessControlError> for MomError {
    fn from(access: AccessControlError) -> Self {
        MomError::AccessControlError(access)
    }
}
impl From<TubError> for MomError {
    fn from(error: TubError) -> Self {
        MomError::TubError(error)
    }
}
impl From<TapError> for MomError {
    fn from(error: TapError) -> Self {
        MomError::TapError(error)
    }
}
impl From<PSP22Error> for MomError {
    fn from(error: PSP22Error) -> Self {
        MomError::PSP22Error(error)
    }
}
