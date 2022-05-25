//use ink_storage::traits::{PackedLayout, SpreadLayout};

//#[cfg(feature = "std")]
//use ink_storage::traits::StorageLayout;
#[brush::wrapper]
pub type OracleTraitRef = dyn OracleTrait;

#[brush::trait_definition]
pub trait OracleTrait {
    /// This function initalizes data of a loan and mint token inside it
    #[ink(message)]
    fn read(&self) -> u128;
}
