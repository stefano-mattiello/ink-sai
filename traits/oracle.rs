#[brush::wrapper]
pub type OracleTraitRef = dyn OracleTrait;

#[brush::trait_definition]
pub trait OracleTrait {
    #[ink(message)]
    fn read(&self) -> u128;
}
